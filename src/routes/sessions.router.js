import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { userRepository } from '../repositories/index.js';
import { createHash, isValidPassword } from '../utils/auth.js'; 
import { restoreTokenModel } from '../dao/models/restoreTokens.model.js'; 
import { sendEmail } from '../services/mailing.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await userRepository.getUserByEmail(email);
        if (exists) return res.status(400).send({ error: 'El usuario ya existe' });

        const newUser = {
            first_name, last_name, email, age,
            password: createHash(password)
        };
        await userRepository.createUser(newUser);
        res.status(201).send({ status: 'success', message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userRepository.getUserByEmail(email);
        if (!user || !isValidPassword(user, password)) {
            return res.status(401).send({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '24h' });

        res.cookie('coderCookieToken', token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            signed: true
        }).send({ status: 'success', message: 'Login exitoso' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userSafeData = userRepository.getCurrentUser(req.user);
    res.send({ status: 'success', payload: userSafeData });
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userRepository.getUserByEmail(email);
        if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

        const token = uuidv4();
        await restoreTokenModel.create({ email, token });

        const link = `http://localhost:8080/api/sessions/reset-password/${token}`;
        await sendEmail(email, "Restablecer Contraseña", `
            <h1>Restablece tu contraseña</h1>
            <p>Haz clic abajo para cambiar tu clave (expira en 1 hora):</p>
            <a href="${link}">Restablecer Contraseña</a>
        `);
        res.send({ status: "success", message: "Correo enviado" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const record = await restoreTokenModel.findOne({ token });
        if (!record) return res.status(400).send({ error: "Token inválido o expirado" });

        const user = await userRepository.getUserByEmail(record.email);
        if (isValidPassword(user, password)) {
            return res.status(400).send({ error: "No puedes usar la misma contraseña anterior" });
        }

        user.password = createHash(password);
        await user.save();
        await restoreTokenModel.deleteOne({ _id: record._id });
        res.send({ status: "success", message: "Contraseña actualizada" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;