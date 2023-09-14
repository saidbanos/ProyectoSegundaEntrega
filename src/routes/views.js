import { Router } from "express";

import ProductManager from "../dao/dbFileSystem/ProductManager.js";
import path from "path";
import __dirname from "../utils.js";
import { productsModel } from "../dao/models/products.js";

const router = Router();

const productsPath = path.join(__dirname, "..", "src", "productos.json");

const productManager = new ProductManager(productsPath);

router.get("/", async (req, res) => {
	try {
		const productDocs = await productsModel.find();
		const products = productDocs.map((doc) => doc.toObject());
		res.render("index", { products });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default router;
