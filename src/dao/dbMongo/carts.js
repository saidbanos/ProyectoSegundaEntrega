import { cartsModel } from "../models/carts.js";
import { productsModel } from "../models/products.js";

export default class CartManager {
	constructor() {}

	getCartById = async (cid) => {
		return await cartsModel.findOne({ _id: cid });
	};

	createNewCart = async () => {
		const newCart = new cartsModel();
		return await newCart.save();
	};

	addProductToCart = async (cid, pid) => {
		const product = await productsModel.findOne({ _id: pid });
		const cart = await cartsModel.findOne({ _id: cid });

		if (!product) {
			return { error: `Product with id ${pid} not found` };
		}

		let existingProductInCart = cart.products.find(
			(p) => p.product.toString() === pid
		);

		if (existingProductInCart) {
			existingProductInCart.quantity += 1;
		} else {
			cart.products.push({
				product: pid,
				quantity: 1,
			});
		}

		return await cartsModel.updateOne({ _id: cid }, cart);
	};
}
