import express from 'express';
import jwt from 'jsonwebtoken';

const authmiddlewares = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
}
export default authmiddlewares;