"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var protect = function (req, res, next) {
    var authHeader = req.headers.authorization;
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided' });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.farmerId = decoded.id;
        req.role = decoded.role;
        next();
    }
    catch (error) {
        console.error('❌ Auth Middleware Error:', error);
        res.status(401).json({ error: 'Token failed, authorization denied' });
    }
};
exports.protect = protect;
