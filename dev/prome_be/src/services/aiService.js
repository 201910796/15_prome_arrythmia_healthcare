const axios = require('axios');
const config = require('../config/config');  // 환경변수 가져오기

async function analyzeECG(data) {
    const response = await axios.post(`${config.ecgUrl}/ai_diag`, data);
    return response.data;
}

async function generateAnswer(data) {
    const response = await axios.post(`${config.ragUrl}/ai_rag`, data);
    return response.data;
}

async function extractSchedule(data) {
    const response = await axios.post(`${config.recommendUrl}/ai_whisper`, data);
    return response.data;
}

async function recommendHospital(data) {
    const response = await axios.post(`${config.recommendUrl}/ai_recommend`, data);
    return response.data;
}

module.exports = {
    analyzeECG,
    generateAnswer,
    extractSchedule,
    recommendHospital,
};
