import express, { request, response } from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import authRounter from "./routes/auth.mjs";
import cartRouter from "./routes/cart.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";

const app = express();
mongoose
	.connect("mongodb://localhost/backend")
	.then(() => console.log("connected to database"))
	.catch((err) => console.log(`Error: ${err}`));

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

app.use(passport.initialize());
app.use(passport.session());

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

app.post("/pass", passport.authenticate("local"), (request, response) => {
	response.sendStatus(200);
});
app.get("/pass/status", (request, response) => {
	console.log(`inside pass/status endpoint`);
	console.log(request.user);
	return request.user
		? response.send(request.user)
		: response.sendStatus(401);
});
app.post("/pass/logout", (request, response) => {
	if (!request.user) return response.sendStatus(401);
	request.logout((err) => {
		if (err) return response.sendStatus(400);
		response.send(200);
	});
});

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
