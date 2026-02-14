import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/auth.js';
import { cartRepository } from '../repositories/index.js';
import ticketModel from '../dao/models/ticket.model.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization('user'), 
    async (req, res) => {
    }
);

router.post('/:cid/purchase', 
    passport.authenticate('jwt', { session: false }), 
    async (req, res) => {
        try {
            const cart = await cartRepository.getCartById(req.params.cid);
            if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

            const { totalAmount, outOfStockProducts } = await cartRepository.processPurchase(cart, req.user.email);

            if (totalAmount > 0) {
                const ticket = await ticketModel.create({
                    code: uuidv4(),
                    amount: totalAmount,
                    purchaser: req.user.email
                });
                const emailContent = `
                    <h1>¡Gracias por tu compra!</h1>
                    <p>Tu código de ticket es: <b>${ticket.code}</b></p>
                    <p>Total abonado: $${ticket.amount}</p>
                    p>Fecha: ${ticket.purchase_datetime}</p>
                `;
                await sendEmail(req.user.email, "Confirmación de Compra - Coder Ecommerce", emailContent);

                cart.products = outOfStockProducts;
                await cartRepository.updateCart(cart._id, cart);

                res.send({ status: "success", payload: ticket, unprocessed: outOfStockProducts.map(p => p.product._id) });
            } else {
                res.status(400).send({ status: "error", message: "No hay stock suficiente para ningún producto" });
            }
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
);