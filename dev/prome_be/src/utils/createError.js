const createError = (status, message, errorCode) => {
    const err = new Error(message);
    err.status = status;
    err.error = errorCode;

    console.error(`[ERROR] ${status} - ${message} (${errorCode})`);
    return err;
};

module.exports = createError;