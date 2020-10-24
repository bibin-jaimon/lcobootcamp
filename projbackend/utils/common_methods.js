
exports.sendErrorMessage = (res, message) => {
    return res.status(400).json({
        error: message
    })
}