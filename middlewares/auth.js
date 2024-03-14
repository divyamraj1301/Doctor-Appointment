const jwt = require("jsonwebtoken");
const User = require('../models/userModels')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token)

        if (token) {
            const verifyUser = jwt.verify(token, process.env.JWT);
            const {id} = verifyUser;
            const rootUser = await User.findById(id);
            req.user_id = rootUser._id;
            req.rootUser = rootUser;
            req.token = token;
            console.log(req.user_id, req.rootUser, req.token)
            next();
        } else {
            res.status(422).json({ msg: "JWT not verified" });
        }


    } catch (err) {
        res.status(422).json({ msg: "JWT not verified" });
    }
};

module.exports = { auth };