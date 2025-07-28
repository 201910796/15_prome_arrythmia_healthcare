require('dotenv').config(); 

module.exports = {
    ecgUrl: process.env.ECG_SERVER_URL,
    ragUrl: process.env.RAG_SERVER_URL,
    recommendUrl: process.env.RECOMMEND_SERVER_URL,
    databaseUrl: process.env.DATABASE_URL,
    port: process.env.PORT || 3000,
    jwtSecretKey:process.env.JWT_SECRET,
    jwtRefreshSecretKey:process.env.JWT_REFRESH_SECRET
};