export default class CartRepository {
    constructor(dao, productDao) {
        this.dao = dao;
        this.productDao = productDao;
    }

    getCartById = async (id) => await this.dao.findById(id).populate('products.product');
    
    updateCart = async (id, cart) => await this.dao.findByIdAndUpdate(id, cart);

    processPurchase = async (cart, userEmail) => {
        let totalAmount = 0;
        const outOfStockProducts = [];
        const purchasedProducts = [];

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await this.productDao.findByIdAndUpdate(product._id, { stock: product.stock });
                totalAmount += product.price * item.quantity;
                purchasedProducts.push(item);
            } else {
                outOfStockProducts.push(item);
            }
        }

        return { totalAmount, outOfStockProducts };
    }
}