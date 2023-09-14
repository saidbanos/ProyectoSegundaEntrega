import { Router } from "express";
import ProductManager from "../dao/dbMongo/products.js";
import path from "path";
import __dirname from "../utils.js";

const router = Router();

const productsPath = path.join(__dirname, "..", "src", "productos.json");

const productManager = new ProductManager();

router.use((req, res, next) => {
	console.log("INFO: Running from products.js");
	next();
});

router.get("/", async (req, res) => {
	try {
		const { limit } = req.query;
		const products = await productManager.getAll(limit);
		res.send(products);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error getting products from the database.");
	}
});

router.get("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const product = await productManager.getById(pid);

		if (product) {
			res.send(product);
		} else {
			res.status(404).send(`The product with id: ${pid} was not found.`);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Error getting product from the database.");
	}
});

router.post("/", async (req, res) => {
	try {
		const product = req.body;
		const result = await productManager.createProduct(product);

		if (typeof result == "string") {
			res.status(400).send({ status: "error", message: result });
		} else {
			res.send({ status: "success" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

router.put("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const productUpdate = req.body;

		const result = await productManager.updateProduct(pid, productUpdate);

		const status = result && result.nModified > 0 ? 200 : 400;
		res.status(status).send(result);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

router.delete("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const result = await productManager.deleteProduct(pid);

		const status = result && result.deletedCount > 0 ? 200 : 404;
		res.status(status).send(result);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default router;
