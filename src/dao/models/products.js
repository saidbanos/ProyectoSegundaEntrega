import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
	id: {
		type: String,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	status: {
		type: Boolean,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	thumbnails: {
		type: Array,
		default: [],
	},
});

export const productsModel = mongoose.model(productsCollection, productsSchema);
