import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

export const validateUrl = (url: string): boolean => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
}

export const base62Encode = (num: number): string => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let encoded = '';
    while (num > 0) {
        encoded = chars[num % 62] + encoded;
        num = Math.floor(num / 62);
    }
    return encoded
}

export const generateToken = (userId: string): string => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'mysecretkey',
        { expiresIn: '7d' }
    )
}

export const validPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (err) {
        console.error('Error verifying password:', err);
        return false;
    }
}

export const hashPassword = async (password: string): Promise<string> => {
    try {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        throw new Error('Password hashing failed');
    }
};
