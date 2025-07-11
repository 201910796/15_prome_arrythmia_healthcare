import os
import json

def extract_answers_from_json(file_path):
    """JSON 파일에서 .answer 필드를 추출 (list 또는 str)"""
    answers = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict) and "answer" in data:
                if isinstance(data["answer"], dict):
                    answers.extend(data["answer"].values())
    except Exception as e:
        print(f"오류 발생 - {file_path}: {e}")
        
    return answers


def collect_all_json_files(root_dir):
    """모든 JSON 파일의 경로 추출 (하위 디렉토리 포함)"""
    json_file_paths = []
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".json"):
                json_file_paths.append(os.path.join(dirpath, filename))

    return json_file_paths


def save_answers_to_txt(input_file_dir, output_file_path):
    """모든 JSON 파일에서 answer만 추출하여 txt로 저장"""
    all_answers = []
    json_file_paths = collect_all_json_files(input_file_dir)
    print(f"총 {len(json_file_paths)}개의 JSON 파일")

    count = 0
    for file_path in json_file_paths:
        count += 1
        print(f"{count:07d}: {file_path}")
        answers = extract_answers_from_json(file_path)
        all_answers.extend(answers)

    with open(output_file_path, "w", encoding="utf-8") as f:
        for answer in all_answers:
            f.write(answer + "\n")

    print(f"총 {len(all_answers)}개의 답변")


if __name__ == "__main__":
    input_file_dir = input("> json 파일을 txt 파일로 변환하려는 디렉토리 : ")
    output_file_path = input_file_dir + ".txt"
    save_answers_to_txt(input_file_dir, output_file_path)