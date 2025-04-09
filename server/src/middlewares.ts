import { Request, Response, NextFunction } from 'express';
import User from './models/user';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string,
    iat: number,
    exp: number
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token, authorization denied' });
        return;
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = User.findById(decoded.id)
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};