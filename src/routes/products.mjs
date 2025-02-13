import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";

const router = Router();

router.get("/products", (request, response) => {
    console.log(request.headers.cookie);
    console.log(request.cookies);
	console.log(request.signedCookies.hello);
	
    if (request.signedCookies.hello && request.signedCookies.hello === "world")
		return response.send(mockProducts)
	
	return response.status(403).send({ msg: "Sorry, you need the correct cookie"})
});
router.post("/products", (request, response) => {
	const { body } = request;
	const newProduct = {
		id: mockProducts[mockProducts.length - 1].id + 1,
		...body,
	};
	mockProducts.push(newProduct);
	return response.status(201).send(newProduct);
});
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