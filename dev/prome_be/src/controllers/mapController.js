const fs = require('fs');
const path = require('path');
const createError = require('../utils/createError');

const totalMap = async(req, res, next) => {
    try {
        // data/hospitals_total.json 파일 경로
        const filePath = path.join(__dirname, '../data/hospitals_total.json');
        
        // 파일이 존재하는지 확인
        if (!fs.existsSync(filePath)) {
            return next(createError(404, 'hospitals_total.json 파일을 찾을 수 없습니다', 'FILE_NOT_FOUND'));
        }

        // JSON 파일 읽기
        const rawData = fs.readFileSync(filePath, 'utf8');
        const hospitalData = JSON.parse(rawData);

        // 필요한 칼럼만 추출하여 변환
        const formattedData = hospitalData.map(hospital => ({
            name: hospital['요양기관명'] || hospital.name || '',
            address: hospital['주소'] || hospital.address || '',
            post: hospital['우편번호'] || hospital.post || '',
            phone: hospital['전화번호'] || hospital.phone || '',
            long: parseFloat(hospital['좌표(X)'] || hospital.long || 0),
            lat: parseFloat(hospital['좌표(Y)'] || hospital.lat || 0)
        }));

        return res.status(200).json({
            data: formattedData,
            message: "전체 병원 데이터 조회 성공",
            success: true,
            count: formattedData.length
        });

    } catch (error) {
        console.error('총 병원 데이터 조회 에러:', error);
        
        if (error instanceof SyntaxError) {
            return next(createError(500, 'JSON 파일 형식이 올바르지 않습니다', 'INVALID_JSON'));
        }
        
        return next(createError(500, '서버 내부 오류가 발생했습니다', 'INTERNAL_SERVER_ERROR'));
    }
};

const heartMap = async(req, res, next) => {
    try {
        // data/hospitals_heart.json 파일 경로
        const filePath = path.join(__dirname, '../data/hospitals_heart.json');
        
        // 파일이 존재하는지 확인
        if (!fs.existsSync(filePath)) {
            return next(createError(404, 'hospitals_heart.json 파일을 찾을 수 없습니다', 'FILE_NOT_FOUND'));
        }

        // JSON 파일 읽기
        const rawData = fs.readFileSync(filePath, 'utf8');
        const hospitalData = JSON.parse(rawData);

        // 필요한 칼럼만 추출하여 변환
        const formattedData = hospitalData.map(hospital => ({
            name: hospital['요양기관명'] || hospital.name || '',
            address: hospital['주소'] || hospital.address || '',
            post: hospital['우편번호'] || hospital.post || '',
            phone: hospital['전화번호'] || hospital.phone || '',
            long: parseFloat(hospital['좌표(X)'] || hospital.long || 0),
            lat: parseFloat(hospital['좌표(Y)'] || hospital.lat || 0)
        }));

        return res.status(200).json({
            data: formattedData,
            message: "심장 관련 병원 데이터 조회 성공",
            success: true,
            count: formattedData.length
        });

    } catch (error) {
        console.error('심장 병원 데이터 조회 에러:', error);
        
        if (error instanceof SyntaxError) {
            return next(createError(500, 'JSON 파일 형식이 올바르지 않습니다', 'INVALID_JSON'));
        }
        
        return next(createError(500, '서버 내부 오류가 발생했습니다', 'INTERNAL_SERVER_ERROR'));
    }
};

module.exports = {
    totalMap,
    heartMap
};
