import re
import os
import bs4
from prompt import PROMPT
from datasets import DATASETS
from concurrent.futures import ThreadPoolExecutor
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader, PyMuPDFLoader, TextLoader, DirectoryLoader, JSONLoader
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from dotenv import load_dotenv
load_dotenv()
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

API_KEY = os.environ.get("API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
DATASET_FILEPATH = "./datasets"
DATABASE_FILEPATH = "./chroma_db"
CHUNK_SIZE = 2500
CHUNK_OVERLAP = 10

# def json_loader_with_schema(file_path):
#     return JSONLoader(file_path=file_path, jq_schema=".answer[]")

# ======================== Load Document ========================
def load_documents(files):
    """다양한 형식의 파일을 읽어 옴"""
    loader = None
    file_path = files[0]
    file_type = files[1]
    if file_type == "HTTP_URLS":
        loader = WebBaseLoader(
            web_paths=file_path,
            bs_kwargs=dict(
                parse_only=bs4.SoupStrainer("section", attrs={"class": [files[2]]})
            ),
        )
    elif file_type == "PDF":
        loader = PyMuPDFLoader(DATASET_FILEPATH + "/" + file_path)
    elif file_type == "TEXT":
        loader = TextLoader(DATASET_FILEPATH + "/" + file_path, encoding="utf-8")
    elif file_type == "DIR_TXT":
        loader = DirectoryLoader(DATASET_FILEPATH + "/" + file_path, glob="**/*.txt", loader_cls=TextLoader, loader_kwargs={"encoding": "utf-8"})
    # elif file_type == "DIR_JSON":
    #     loader = DirectoryLoader(DATASET_FILEPATH + "/" + file_path, glob="**/*.json", loader_cls=json_loader_with_schema)
    else:
        print("Invalid File Type:", file_path)
    return loader.load()

def preprocessing(document):
    """문서 전처리"""
    document.page_content = re.sub(r"\n", " ", document.page_content)
    document.page_content = re.sub(r"\s{2,}", " ", document.page_content)
    return document

def make_document(files, chunk_size, chunk_overlap):
    """파일을 데이터베이스에 저장하기 위해 CHUNK로 분할"""
    with ThreadPoolExecutor() as executor:
        results = executor.map(load_documents, files)
    
    docs = [preprocessing(doc) for result in results for doc in result]
    print("문서 수 :", len(docs))

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    split_documents = text_splitter.split_documents(docs)
    return split_documents


# ======================== Build Database ========================
def make_database(split_documents):
    """데이터베이스 구축"""
    embeddings = HuggingFaceEmbeddings(model_name='jhgan/ko-sbert-nli')
    # embeddings = HuggingFaceEmbeddings(model_name='intfloat/multilingual-e5-small')

    if os.path.exists(DATABASE_FILEPATH):
        vector_store = Chroma(persist_directory=DATABASE_FILEPATH, embedding_function=embeddings)
        if split_documents:
            vector_store.add_documents(split_documents)
    else:
        vector_store = Chroma.from_documents(documents=split_documents, embedding=embeddings, persist_directory=DATABASE_FILEPATH)
    return vector_store.as_retriever()


# ======================== Build Language Model ========================
def make_prompt():
    """프롬프트 생성"""
    return PromptTemplate.from_template(
      " ".join(PROMPT.values()) + """
        Generate an answer based on the provided context, as well as the patient's ECG and body temperature data (if exist):
        # Previous conversation: {chat_history}
        # Context: {context}
        # Question: {question}
      """
    )

def make_model():
    """LLM 모델 생성"""
    return ChatOpenAI(
        model="gpt-4-1106-preview",
        temperature=0.7,
        max_tokens=1024,
        openai_api_key=OPENAI_API_KEY
    )
    # return ChatGoogleGenerativeAI(
    #     model="gemini-2.5-flash",
    #     api_key=API_KEY
    # )


user_memories = {}
def make_memory(user_id):
    """채팅 기록을 위한 메모리"""
    if user_id not in user_memories:
        user_memories[user_id] = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    return user_memories[user_id]

def make_chain(model, retriever, memory, prompt):
    return ConversationalRetrievalChain.from_llm(
        llm=model,
        retriever=retriever,
        memory=memory,
        combine_docs_chain_kwargs={"prompt": prompt},
    )

def run_ai(question, ecg, temp, chain):
    return chain.invoke({"question": f"{question}\n(환자의 심전도 수치: {ecg}, 체온: {temp}도)"})["answer"]


# ======================== FastAPI ========================
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LLMRequest(BaseModel):
    question: str
    ecg: int
    temp: float
    user_id: int
    chat_id: int


# for DATASET in DATASETS:
#     print(DATASET)
#     documents = make_document(files=(DATASET,), chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
#     retriever = make_database(documents)
#     print("└> 완료")

documents = None
if not os.path.exists(DATABASE_FILEPATH):
    documents = make_document(files=DATASETS, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
retriever = make_database(documents)
prompt = make_prompt()
model = make_model()


@app.post("/ai_rag")
async def chat(request: LLMRequest):
    '''
    Request : question | ecg | temp | user_id | chat_id
    Response : content | is_diag | is_recommend
    '''
    try:
        memory = make_memory(str(request.user_id) + "/" + str(request.chat_id))
        chain = make_chain(model, retriever, memory, prompt)
        answer = run_ai(request.question, request.ecg, request.temp, chain)

        is_diag = False
        is_recommend = False
        if "<진단/>" in answer:
            answer = answer.replace("<진단/>", "")
            is_diag = True
        elif "<병원/>" in answer:
            answer = answer.replace("<병원/>", "")
            is_recommend = True

        return JSONResponse(content={"content": answer, "is_diag": is_diag, "is_recommend": is_recommend},
                            media_type="application/json; charset=utf-8")
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("agent:app", host="0.0.0.0", port=8000, reload=True)