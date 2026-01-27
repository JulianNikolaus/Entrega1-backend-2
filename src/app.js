import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const app = express();

app.use(express.json());
app.use(cookieParser());


initializePassport();
app.use(passport.initialize());