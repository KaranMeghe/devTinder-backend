
// Whitelist fields (avoid letting clients to set random fields)
function sanitizeUserInput(req, res, next) {
    const allowedFields = ["firstName", "lastName", "emailId", "password", "age", "gender", "about", "skills"];
    const sanitized = {};

    for (let key of allowedFields) {
        if (req.body[key] !== undefined) {
            sanitized[key] = req.body[key];
        }
    }
    req.body = sanitized;
    next();
}

module.exports = sanitizeUserInput;