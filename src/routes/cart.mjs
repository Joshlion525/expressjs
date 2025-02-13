import { Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { cartItemSchema } from "../utils/validationSchemas.mjs";

const router = Router();

router.post("/cart", checkSchema(cartItemSchema), (request, response) => {
	if (!request.session.client) return response.sendStatus(401);
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const { body: item } = request;
	const { cart } = request.session;
	if (cart) {
		cart.push(item);
	} else {
		request.session.cart = [item];
	}
	return response.status(201).send(item);
});
router.get("/cart", (request, response) => {
	if (!request.session.client) return response.sendStatus(401);
	return response.send(request.session.cart ?? []);
});


export default router;
