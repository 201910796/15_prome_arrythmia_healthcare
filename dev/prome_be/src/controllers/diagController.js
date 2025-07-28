import jwt from 'jsonwebtoken';
import prisma from '../models/prisma.js';
import createError from '../utils/createError.js';
import * as ai from '../services/aiService.js';

export const diagnose = async (req, res, next) => {
    // TODO : AI 서버에 데이터 보냄
    // AI -> 검사 실행
    // TODO : 결과를 DB에 추가
};

export const diagResult = async (req, res, next) => {
    // TODO : 특정 diag_id 의 DB 정보 GET
};