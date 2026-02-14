import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req, res) => {});

router.post('/', 
    passport.authenticate('jwt', { session: false }),
    authorization('admin'),                          
    async (req, res) => {
        res.send({ status: "success", message: "Producto creado" });
    }
);

router.put('/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization('admin'), 
    async (req, res) => {
    }
);

router.delete('/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization('admin'), 
    async (req, res) => {
    }
);

export default router;