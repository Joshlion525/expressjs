import express, { request, response } from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import {loggingMiddleware} from "./utils/middlewares.mjs"

const app = express();

app.use(express.json.apply());
app.use(usersRouter);
app.use(productsRouter);
// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

app.get("/", loggingMiddleware, (request, response) => {
	response.status(201).send({ msg: "Hello" });
});

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
