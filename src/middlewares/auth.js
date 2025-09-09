export const adminAuth = (req, res, next) => {
    const token = "xzyh";
    const isAdmn = token === "xzyh";

    if (!isAdmn) {
        res.status(401).send("Unauthorised user");
    } else {
        next();
    }
};