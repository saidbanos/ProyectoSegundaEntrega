import { Router } from "express";
import CartManager from "../dao/dbMongo/carts.js";

const router = Router();
const cartManager = new CartManager();

router.use((req, res, next) => {
	console.log("INFO: Running from carts.js");
	next();
});

router.get("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const cart = await cartManager.getCartById(cid);
		if (cart) {
			res.send(cart);
		} else {
			res.status(404).send(`Cart with id ${cid} not found`);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

router.post("/", async (req, res) => {
	try {
		const result = await cartManager.createNewCart();
		res.status(201).send(result);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

router.post("/:cid/product/:pid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const pid = req.params.pid;

		const result = await cartManager.addProductToCart(cid, pid);

		if (result.error) {
			res.status(404).send(result.error);
		} else {
			res.status(result.nModified > 0 ? 200 : 400).send(result);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default router;
