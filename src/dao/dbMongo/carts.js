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

		if (!cart) {
			return { error: `Cart with id ${cid} not found` };
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

	removeProductFromCart = async (cid, pid) => {
		const cart = await this.getCartById(cid);
		if (!cart) {
			return { error: `Cart with id ${cid} not found` };
		}

		const result = await cartsModel.updateOne(
			{ _id: cid },
			{ $pull: { products: { product: pid } } }
		);

		if (result.nModified === 0) {
			return { error: `Product with id ${pid} not found in cart` };
		}
		return result;
	};

	updateCartProducts = async (cid, productsToUpdate) => {
		try {
			const cart = await cartsModel.findOne({ _id: cid });
			if (!cart) {
				throw new Error(`Cart with ID ${cid} not found.`);
			}

			const updatedProducts = [];

			for (let p of productsToUpdate) {
				const product = await productsModel.findOne({ _id: p.id });

				if (!product) {
					throw new Error(`Product with ID ${p.id} not found.`);
				}

				updatedProducts.push({
					product: p.id,
					quantity: p.quantity,
				});
			}

			cart.products = updatedProducts;
			cart.markModified("products");
			await cart.save();

			return cart;
		} catch (error) {
			console.error("Error in updateCartProducts:", error);
			throw error;
		}
	};

	updateProductQuantity = async (cid, pid, quantity) => {
		const cart = await this.getCartById(cid);
		if (!cart) {
			return { error: `Cart with id ${cid} not found` };
		}

		const productInCart = cart.products.find(
			(p) => p.product.toString() === pid
		);

		if (!productInCart) {
			return { error: `Product with id ${pid} not found in cart` };
		}

		productInCart.quantity = quantity;

		return await cartsModel.updateOne({ _id: cid }, cart);
	};

	removeAllProductsFromCart = async (cid) => {
		const cart = await this.getCartById(cid);
		if (!cart) {
			return { error: `Cart with id ${cid} not found` };
		}

		const result = await cartsModel.updateOne(
			{ _id: cid },
			{ $set: { products: [] } }
		);

		return result;
	};
}
