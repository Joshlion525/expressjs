import { Router } from "express";
import {
	query,
	validationResult,
	body,
	matchedData,
	checkSchema,
} from "express-validator";
import {
	createUsersValidationSchema,
	getUsersValidationSchema,
} from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";


const router = Router();

router.get(
	"/users",
	checkSchema(getUsersValidationSchema),
	(request, response) => {
		const result = validationResult(request);
		console.log(result);
		const {
			query: { filter, value },
		} = request;
		if (filter && value)
			return response.send(
				mockUsers.filter((user) => user[filter].includes(value))
			);
		return response.send(mockUsers);
	}
);
router.get("/users/:id", (request, response) => {
	console.log(request.params);
	const parsedId = parseInt(request.params.id);
	if (isNaN(parsedId))
		return response.status(400).send({ msg: "Invalid ID" });

	const findUser = mockUsers.find((user) => user.id === parsedId);
	if (!findUser) return response.sendStatus(404);
	return response.send(findUser);
});
router.post("/users",	checkSchema(createUsersValidationSchema),
	(request, response) => {
		const result = validationResult(request);
		console.log(result);
		if (!result.isEmpty())
			return response.status(400).send({ errors: result.array() });

		const data = matchedData(request);
		const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
		mockUsers.push(newUser);
		return response.status(201).send(newUser);
	});
router.put("/users/:id", (request, response) => {
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
router.patch("/users/:id", (request, response) => {
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
router.delete("/users/:id", (request, response) => {
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


export default router;