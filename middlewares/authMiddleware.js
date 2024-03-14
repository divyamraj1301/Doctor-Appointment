const jtoken = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        jtoken.verify(token, process.env.JWT, (err, decode) => {
            if (err) {
                return res.status(200).json({ message: 'Authorization issue.', success: false });
            }
            else {
                req.body.userId = decode.id;
                next();
            }
        })
    } catch (error) {
        res.status(401).json({ message: 'Auth fail', success: false });
    }
}