import passport from "passport";
import { Strategy } from "passport-local";
import { mockClients } from "../utils/constants.mjs";

passport.serializeUser((client, done) => {
	console.log(`inside serialize user`);
	console.log(client);
	done(null, client.id);
});
passport.deserializeUser((id, done) => {
	console.log(`inside deserialize`);
	console.log(`deserialize id ${id}`);

	try {
		const findUser = mockClients.find(
			(client) => client.id === id
		);
		if (!findUser) throw new Error("User not found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
	new Strategy((username, password, done) => {
		console.log(`username: ${username}`);
		console.log(`password: ${password}`);

		try {
			const findUser = mockClients.find(
				(client) => client.username === username
			);
			if (!findUser) throw new Error("User not found");
			if (findUser.password !== password)
				throw new Error("Invalid passowrd");
			done(null, findUser);
		} catch (err) {
			done(err, null);
		}
	})
);
