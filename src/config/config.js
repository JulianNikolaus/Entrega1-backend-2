import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (result.error) {
    console.error("ERROR CRÍTICO: No se pudo cargar el archivo .env", result.error);
}

export default {
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET || 'SecretTemporalParaQueNoExplote',
    cookieSecret: process.env.COOKIE_SECRET || 'CookieSecretTemporal',
    mailingUser: process.env.MAILING_USER,
    mailingPassword: process.env.MAILING_PASSWORD,
};