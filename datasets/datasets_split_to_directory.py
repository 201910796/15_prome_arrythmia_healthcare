import os

def split_txt_by_char_dynamic(input_path, base_output_dir, num_parts=30):
    file_size = os.path.getsize(input_path)
    print(f"원본 파일 크기: {file_size / (1024*1024):.2f} MB")

    num_folders = (file_size // (50 * 1024 * 1024)) + 1
    
    with open(input_path, 'r', encoding='utf-8') as f:
        text = f.read()

    total_len = len(text)
    total_parts = num_parts * num_folders
    chunk_size = total_len // total_parts
    remainder = total_len % total_parts

    start = 0
    for i in range(total_parts):
        end = start + chunk_size + (1 if i < remainder else 0)
        chunk = text[start:end]

        folder_index = i // num_parts  # 0, 1, 2
        folder_name = f"{base_output_dir}_{folder_index+1}"
        os.makedirs(folder_name, exist_ok=True)

        file_index = i % num_parts
        output_path = os.path.join(folder_name, f"{base_output_dir}_{folder_index+1}_{file_index+1:02d}.txt")

        with open(output_path, 'w', encoding='utf-8') as out_f:
            out_f.write(chunk)

        start = end

    print(f"{num_folders}개 폴더에 총 {total_parts}개 파일 저장 완료")

docs = ["뇌신경정신질환", "소화기질환", "순환기질환", "신장비뇨기질환", "유방내분비질환", "응급질환", "종양혈액질환", "호흡기질환"]
for doc in docs:
    split_txt_by_char_dynamic(doc + ".txt", doc)