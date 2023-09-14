import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
	id: {
		type: String,
	},
	products: {
		type: [
			{
				product: {
					type: String,
				},
				quantity: Number,
			},
		],
		default: [],
	},
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
