import express, { request, response } from "express";

const app = express();
app.use(express.json.apply());
const PORT = process.env.PORT || 3000;
const mockUsers = [
	{ id: 1, username: "josh", displayname: "Joshua" },
	{ id: 2, username: "james", displayname: "James" },
	{ id: 3, username: "faouq", displayname: "Weed roller" },
];
const mockProducts = [
	{ id: 12, name: "combat trouser", price: 14.99 },
	{ id: 13, name: "denim shirt", price: 10.99 },
];

app.get("/", (request, response) => {
	// response.send("Hello world!");
	response.status(201).send({ msg: "Hello" });
});
app.get("/users", (request, response) => {
	console.log(request.query);
	const {
		query: { filter, value },
	} = request;
	if (filter && value)
		return response.send(
			mockUsers.filter((user) => user[filter].includes(value))
		);
	return response.send(mockUsers);
});
app.post("/users", (request, response) => {
	const { body } = request;
	const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
	mockUsers.push(newUser);
	return response.status(201).send(newUser);
});
app.get("/users/:id", (request, response) => {
	console.log(request.params);
	const parsedId = parseInt(request.params.id);
	if (isNaN(parsedId))
		return response.status(400).send({ msg: "Invalid ID" });

	const findUser = mockUsers.find((user) => user.id === parsedId);
	if (!findUser) return response.sendStatus(404);
	return response.send(findUser);
});
app.get("/products", (request, response) => {
	response.send(mockProducts);
});
app.post("/products", (request, response) => {
	const { body } = request;
	const newProduct = {
		id: mockProducts[mockProducts.length - 1].id + 1,
		...body,
	};
	mockProducts.push(newProduct);
	return response.status(201).send(newProduct);
});
app.get("/products/:id", (request, response) => {
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

app.put("/users/:id", (request, response) => {
	const {
		body,
		params: { id },
	} = request;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return response.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return response.sendStatus(404);
	mockUsers[findUserIndex] = { id: parsedId, ...body };
	return response.sendStatus(204);
});
app.patch("/users/:id", (request, response) => {
	const {
		body,
		params: { id },
	} = request;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return response.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return response.sendStatus(404);
	mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
	return response.sendStatus(200);
});

app.delete("/users/:id", (request, response) => {
	const {
		params: { id },
	} = request;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return response.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return response.sendStatus(404);
	mockUsers.splice(findUserIndex, 1);
	return response.sendStatus(200);
});

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
