module.exports = (err, req, res, next) => {
    console.error('에러 발생:', err);

    const status = err.status || 500;
    const message = err.message || '서버 오류';
    const errorCode = err.error || 'SERVER_ERROR';

    res.status(status).json({
        success: false,
        message,
        error: errorCode
    });
};
