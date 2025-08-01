## 프로젝트 제목
**당신의 심장건강 비서, 콩콩** 

  
![Image](https://github.com/user-attachments/assets/b863d18f-ad85-4730-9969-61552c45fe96)


## (1) 프로젝트 소개
### 팀원 
**<인공지능 연합동아리 프로메테우스 15팀>**   
김형선 **(Team Leader & AI Model Engineer)**   
유동균 **(AI Model Engineer)**  
박찬영 **(Promt Engineer)**
이강룡 **(Full-Stack Developer)**   
손채원 **(Designer)**   

### 개발 기간
24.03.09 - 25.08.02
### 개요
**언제 찾아올 지 모르는 부정맥을 가정에서 진단하기 위한 헬스케어 애플리케이션에 Ai Agent 기능을 도입해 ECG 측정을 통한 부정맥 예측, 심혈관계 의료 지식 질의응답, 병원위치 추천  
등의 기능을 AI 챗봇 콩콩이와 대화형으로 제공받을 수 있는 애플리케이션**  
### 목표
**1. 프롬프트 엔지니어링과 RAG 검색에 기반한 환자의 증상이나 질병 관련 질문에 대한 신뢰성 있는 답변을 제공**
- Gemini-2.5-flash api에 AIHub의 방대한 '의료질의응답' 데이터를 결합한 신뢰성 있는 답변 생성    
- 프롬프트 엔지니어링을 통해 정해진 format안에서 답변하도록 규율하고 의학 지식에 특화돼 있는 의료 질의응답 전문 챗봇 구축   
  
**2. 기존 ECG 데이터를 바탕으로 LSTM-CNN 부정맥 예측 모델을 학습하고 아두이노 기기로 실제 ECG 데이터를 측정해 실전에서의 적용 가능성을 확인**  
- LSTM-CNN 모델을 활용해 심장 의학에서의 딥러닝 적용 가능성을 탐구. => Precision 89.8%, Recall 92.6 의 성능을 보여 실전에서도 충분히 적용 가능함을 확인 
- 단순 모델 구축을 넘어 AD8232를 통해 실제 데이터를 관측하고 

**3. ECG 데이터 필터링 과정을 통한 생체신호 데이터에 대한 보다 깊은 이해**

- Bandpass filter와 Notch 필터를 활용해 전력선 잡음, 미세한 떨림과 같은 ECG 측정 데이터에 섞인 노이즈를 제거하는 과정을 통해 생체신호 데이터의 전처리 과정을 이해    
 
**4. 실제 환경에서 적용 가능한 시스템 아키텍처 구축**
- Node.js의 메인 서버를 기반으로 fastapi를 활용해 각 AI모델의 서버를 분리하고 ngrok을 통한 데이터 전송 환경을 구축해 협업과정에서 안정적인 시스템 아키텍처 환경을 구축  

**5. 사용자 친화적 인터페이스를 사용한 친숙**  
- 콩콩이라는 AI 비서 캐릭터의 이름에 맞춰 통통 뛰는 듯한 인트로 모션과 사용자들이 접근하기 쉬운 UI를 사용함으로써 딱딱할 수 있는 헬스케어 앱에 대한 부드러운 이미지 확보 
## (2) 기술 스택
<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"><img src="https://img.shields.io/badge/jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white"><img src="https://img.shields.io/badge/css-663399?style=for-the-badge&logo=css&logoColor=white"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=Node.js&logoColor=white">   
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"><img src="https://img.shields.io/badge/hugging face-FFD21E?style=for-the-badge&logo=hugging face&logoColor=white"><img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"><img src="https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white">
## (3) 데이터 수집
**Arrythmia Prediction Dataset**   
- Kaggle, ECG Heartbeat Categorization Dataset
  https://www.kaggle.com/datasets/shayanfazeli/heartbeat/data?select=ptbdb_abnormal.csv  

**Healthcare chatbot Dataset**      
- AIHub, 초거대 AI 헬스케어 질의응답 데이터
  https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=data&dataSetSn=71762        

**Hospital location Dataset**     
- 보건의료빅데이터개방시스템, 전국 병의원 및 약국 현황
  https://opendata.hira.or.kr/op/opc/selectOpenData.do?sno=11925&publDataTpCd=&searchCnd=ttl&searchWrd=%EC%A0%84%EA%B5%25

## (4) 프로젝트 진행 과정
**<노션 링크>**  
https://www.notion.so/ai-prometheus/15-1ad8a75b869a80d69092f73c564362fc
**<ERD>**
![Image](https://github.com/user-attachments/assets/b92083ff-d681-4929-b0f7-759f518d7f7c)  
**<시스템 아키텍처>**  
![Image](https://github.com/user-attachments/assets/690c1928-4764-4522-8851-e938a33eb128)  




