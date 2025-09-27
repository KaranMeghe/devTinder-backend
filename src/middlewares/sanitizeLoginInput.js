function sanitizeLoginInput(req, res, next) {
    // Only allowed safe fields 
    const allowedFields = ['emailId', 'password'];
    const requestFields = Object.keys(req.body);


    // Find extra field 
    const extraFields = requestFields.filter((field) => !allowedFields.includes(field));

    if (extraFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Invalid fields in request: ${extraFields.join(', ')}`
        });
    }

    // keep only allowed fields (safe)
    const sanitized = {};
    for (let key of allowedFields) {
        if (req.body[key] !== undefined) {
            sanitized[key] = req.body[key];
        }
    }
    req.body = sanitized;
    next();
}

module.exports = sanitizeLoginInput;