import jwt from 'jsonwebtoken';

const PRIVATE_KEY = "CoderKeyQueDeberiaEstarEnElDotEnv"; // Usa una variable de entorno en producción

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
};