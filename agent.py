import re
import os
import bs4
from prompt import PROMPT
from datasets import DATASETS
from concurrent.futures import ThreadPoolExecutor
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader, PyMuPDFLoader, TextLoader
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
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
DATASET_FILEPATH = "./datasets"
DATABASE_FILEPATH = "./chroma_db"
CHUNK_SIZE = 2500
CHUNK_OVERLAP = 20

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
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    split_documents = text_splitter.split_documents(docs)
    return split_documents


# ======================== Build Database ========================
def make_database(split_documents):
    """데이터베이스 구축"""
    embeddings = HuggingFaceEmbeddings(model_name='intfloat/multilingual-e5-small')

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
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        api_key=API_KEY
    )

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


# ======================== Main ========================
# if __name__ == "__main__":
#     documents = make_document(files=DATASETS, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
#     # documents = None
#     retriever = make_database(documents)
#     prompt = make_prompt()
#     model = make_model()
#     memory = make_memory()
#     chain = make_chain(model, retriever, memory, prompt)

#     print("""> 안녕하세요, 의료용 AI Agent입니다. 몸이 불편한 곳이 있거나, 건강과 관련하여 궁금한 점이 있으면 물어봐주세요!""")
#     while True:
#         question = input(">> ")
#         if question == "</종료>":
#             break
#         answer = run_ai(question, chain)
#         if "</종료>" in answer:  # 종료하는 경우
#             print(">", answer.replace("</종료>", ""))
#             break
#         elif "</진단>" in answer:  # 진단으로 넘어가는 경우
#             print(">", answer.replace("</진단>", ""))
#             print("심전도/체온 측정을 진행합니다 ···")
#             break
#         else:
#             print(">", answer)
#             print()


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
    user_id: str

# documents = make_document(files=DATASETS, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
documents = None
retriever = make_database(documents)
prompt = make_prompt()
model = make_model()

@app.post("/ai_rag")
async def chat(request: LLMRequest):
    '''응답(Response) 형태 : JSON / answer (응답), tag (Tool로 넘어가기)'''
    try:
        memory = make_memory(request.user_id)
        chain = make_chain(model, retriever, memory, prompt)
        answer = run_ai(request.question, request.ecg, request.temp, chain)

        tag = None
        if "</진단>" in answer:
            answer = answer.replace("</진단>", "")
            tag = "진단"
        elif "</결과>" in answer:
            answer = answer.replace("</결과>", "")
            tag = "결과"
        elif "</병원>" in answer:
            answer = answer.replace("</병원>", "")
            tag = "병원"

        return JSONResponse(content={"answer": answer, "tag": tag},
                            media_type="application/json; charset=utf-8")
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("agent:app", host="0.0.0.0", port=8000, reload=True)