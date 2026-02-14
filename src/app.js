
import config from './config/config.js'; 
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

mongoose.connect(config.mongoUrl)
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch(err => console.log("Error de conexión:", err));

app.use(express.json());
app.use(cookieParser(config.cookieSecret));

initializePassport();
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);

app.listen(config.port, () => console.log(`🚀 Server on port ${config.port}`));