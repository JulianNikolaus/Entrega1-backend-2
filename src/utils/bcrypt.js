import jwt from 'jsonwebtoken';

const PRIVATE_KEY = "CoderKeyQueDeberiaEstarEnElDotEnv"; 

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
};