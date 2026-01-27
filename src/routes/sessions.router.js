import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: 'user'
        };

        const result = await userModel.create(user);
        res.send({ status: "success", message: "Usuario registrado con éxito", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error en el servidor" });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send({ status: "error", error: "Credenciales inválidas" });

        
        if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Credenciales inválidas" });

        
        const token = generateToken(user);

        
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true 
        }).send({ status: "success", message: "Login exitoso" });

    } catch (error) {
        res.status(500).send({ status: "error", error: "Error en el servidor" });
    }
});

export default router;

import passport from 'passport';


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    if (!req.user) {
        return res.status(401).send({ status: "error", error: "No autorizado" });
    }

    res.send({ status: "success", payload: req.user });
});