import express, { request, response } from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import authRounter from "./routes/auth.mjs";
import cartRouter from "./routes/cart.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
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
app.use(authRounter);
app.use(cartRouter);
// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

app.get("/", loggingMiddleware, (request, response) => {
	console.log(request.session);
	console.log(request.session.id);
	request.session.visited = true;
	response.cookie("hello", "world", { maxAge: 60000 * 60, signed: true });
	response.status(201).send({ msg: "Hello" });
});

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
