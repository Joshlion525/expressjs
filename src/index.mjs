import express, { request, response } from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { checkSchema, validationResult } from "express-validator";
import { mockClients } from "./utils/constants.mjs";
import {
	getClientsValidation,
	cartItemSchema,
} from "./utils/validationSchemas.mjs";
import { loggingMiddleware } from "./utils/middlewares.mjs";

const app = express();
app.use(express.json.apply());
app.use(cookieParser("helloworld"));
app.use(
	session({
		secret: "Joshua",
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 60000 * 60,
		},
	})
);
app.use(usersRouter);
app.use(productsRouter);
// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

app.get("/", loggingMiddleware, (request, response) => {
	console.log(request.session);
	console.log(request.session.id);
	request.session.visited = true;
	response.cookie("hello", "world", { maxAge: 60000 * 60, signed: true });
	response.status(201).send({ msg: "Hello" });
});

app.post("/auth", checkSchema(getClientsValidation), (request, response) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const { username, password } = request.body;
	const findClient = mockClients.find(
		(client) => client.username === username
	);
	if (!findClient || findClient.password !== password) {
		return response.status(401).send({ msg: "Bad Credentials" });
	}
	request.session.client = findClient;
	return response.status(200).send(findClient);
});
app.get("/auth/status", (request, response) => {
	request.sessionStore.get(request.sessionID, (err, session) => {
		console.log(session);
	});
	return request.session.client
		? response.status(200).send(request.session.client)
		: response.status(401).send({ msg: "Not Authenticated" });
});
app.post("/cart", checkSchema(cartItemSchema), (request, response) => {
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
app.get("/cart", (request, response) => {
	if (!request.session.client) return response.sendStatus(401);
	return response.send(request.session.cart ?? []);
});

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
