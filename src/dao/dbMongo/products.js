import { productsModel } from "../models/products.js";

export default class ProductManager {
	constructor() {}

	getAll = async (limit) => {
		let products = await productsModel.find();
		products = products.map((product) => product.toObject());

		if (limit && !isNaN(limit) && limit > 0) {
			products = products.slice(0, Number(limit));
		}

		return products;
	};

	getById = async (id) => {
		const product = await productsModel.findOne({ _id: id });
		if (product) {
			return product.toObject();
		}
		return null;
	};

	createProduct = async (productData) => {
		try {
			const newProduct = new productsModel(productData);
			const result = await newProduct.save();
			return result;
		} catch (error) {
			throw error;
		}
	};

	updateProduct = async (id, productUpdate) => {
		try {
			const result = await productsModel.updateOne({ _id: id }, productUpdate);
			return result;
		} catch (error) {
			throw error;
		}
	};

	deleteProduct = async (id) => {
		try {
			const result = await productsModel.deleteOne({ _id: id });
			return result;
		} catch (error) {
			throw error;
		}
	};
}
