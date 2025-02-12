import { Router } from "express";
import { getClientsValidation } from "../utils/validationSchemas.mjs";
import { checkSchema, validationResult } from "express-validator";
import { mockClients } from "../utils/constants.mjs";


const router = Router();

router.post("/auth", checkSchema(getClientsValidation), (request, response) => {
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

router.get("/auth/status", (request, response) => {
	request.sessionStore.get(request.sessionID, (err, session) => {
		console.log(session);
	});
	return request.session.client
		? response.status(200).send(request.session.client)
		: response.status(401).send({ msg: "Not Authenticated" });
});


export default router;