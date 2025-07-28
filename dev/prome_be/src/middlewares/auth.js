const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');
const config = require('../config/config');

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(createError(401, '인증이 필요합니다.', 'INVALID_TOKEN'));
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return next(createError(401, '유효하지 않은 토큰입니다.', 'INVALID_TOKEN'));
    }
};

module.exports = auth;
