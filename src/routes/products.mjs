import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";
import {
	query,
	validationResult,
	body,
	matchedData,
	checkSchema,
} from "express-validator";
import { cartItemSchema } from "../utils/validationSchemas.mjs";
import { Product } from "../mongoose/schemas/product.mjs";

const router = Router();

router.get("/products", (request, response) => {
	return response.status(200).send(mockProducts);
});

router.post(
	"/products",
	checkSchema(cartItemSchema),
	async (request, response) => {
		const result = validationResult(request);
		if (!result.isEmpty()) return response.status(400).send(result.array());
		const data = matchedData(request);

		try {
			const existingProduct = await Product.findOne({
				name: data.name,
			});
			if (existingProduct) {
				return response
					.status(400)
					.json({ msg: "Product already exists" });
			}
			const newProduct = new Product(data);
			const savedProduct = newProduct.save();
			return response.status(201).sen(savedProduct);
		} catch (err) {
			console.log(err);
			return response.sendStatus(401);
		}
	}
);
router.get("/products/:id", (request, response) => {
	console.log(request.params);
	const parsedId = parseInt(request.params.id);
	if (isNaN(parsedId))
		return response
			.status(400)
			.send({ msg: "This product does not exist" });

	const findProduct = mockProducts.find((product) => product.id === parsedId);
	if (!findProduct) return response.sendStatus(404);
	return response.send(findProduct);
});
router.put("/products/:id", (request, response) => {
	const {
		body,
		params: { id },
	} = request;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return response.sendStatus(400);
	const findProductIndex = mockProducts.findIndex(
		(product) => product.id === parsedId
	);
	if (findProductIndex === -1) return response.sendStatus(404);
	mockProducts[findProductIndex] = { id: parsedId, ...body };
	return response.sendStatus(204);
});

export default router;
