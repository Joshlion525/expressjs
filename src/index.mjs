import express, { request, response } from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import { loggingMiddleware } from "./utils/middlewares.mjs";

const app = express();
app.use(express.json.apply());
app.use(cookieParser());
app.use(usersRouter);
app.use(productsRouter);
// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

app.get("/", loggingMiddleware, (request, response) => {
	response.cookie("hello", "world", { maxAge: 60000 * 60});
	response.status(201).send({ msg: "Hello" });
});
app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
