const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const createError = require('../utils/createError');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const config = require("../config/config");

module.exports.register = async (req, res, next) => {
    try {
        const { id, password, name, age, gender, phone } = req.body;

        if (!id || !password) {
            return next(createError(400, '정보를 다 입력해주세요', 'INVALID_INPUT'));
        }

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (existingUser) {
            return next(createError(409, '이미 가입된 아이디입니다.', 'ID_EXISTS'));
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10: 복잡도
        await prisma.user.create({
            data: { id, password: hashedPassword, name, age, gender, phone }
        });

        return res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            success: true
        });
    } catch (err) {
        next(err);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { id, password } = req.body;

        if (!id || !password) {
            return next(createError(400, '정보를 다 입력해주세요.', 'INVALID_INPUT'));
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(createError(401, '회원 정보가 일치하지 않습니다.', 'INVALID_INFO'));
        }

        const accessToken = generateAccessToken(user.user_id);
        const refreshToken = generateRefreshToken(user.user_id);

        return res.status(200).json({
            message: '로그인 성공',
            accessToken,
            refreshToken,
            success: true
        });
    } catch (err) {
        next(err);
    }
};

module.exports.logout = async (req, res, next) => {
    try {
    
        // 모바일 환경에서는 보통 토큰을 클라이언트에서 삭제하므로 서버에서는 단순 성공 응답만 처리
        return res.status(200).json({
            message: '로그아웃 성공',
            success: true
        });
    } catch (err) {
        next(err);
    }
};

module.exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return next(createError(400, 'refresh token이 없습니다.', 'NO_REFRESH_TOKEN'));
        }

        const decoded = jwt.verify(refreshToken, config.jwtRefreshSecretKey);
        const newAccessToken = generateAccessToken(decoded.userId);

        return res.status(200).json({
            accessToken: newAccessToken,
            success: true
        });
    } catch (err) {
        return next(createError(403, '유효하지 않은 refresh token입니다.', 'INVALID_REFRESH_TOKEN'));
    }
};


