
function sanitizeUpdateInput(req, res, next) {

    // check if request contains dissAllowed fields
    const { _id, ...rest } = req.body;

    if (rest.emailId !== undefined) {
        return res.status(400).json({
            success: false,
            message: `Updating emailId is not allowed`
        });
    }


    // Only allow safe fields
    const allowedFields = ["firstName", "lastName", "password", "age", "gender", "about", "skills"];
    const sanitize = {};

    // Loop over the key client actually sends
    for (let key of Object.keys(rest)) {
        if (!allowedFields.includes(key)) {
            return res.status(400).json({
                success: false,
                message: `You can't add or update this field: ${key}`
            });
        }
        // Extra rule for skills
        if (rest.skills.length > 10) {
            return res.status(400).json({
                success: false,
                message: "You can not add skills more than 10"
            });
        }

        sanitize[key] = rest[key];
    }

    req.body = { _id, ...sanitize };
    next();
}

module.exports = sanitizeUpdateInput;