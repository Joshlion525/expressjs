import passport from "passport";
import { Strategy } from "passport-local";
import { mockClients } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((client, done) => {
	console.log(`inside serialize user`);
	console.log(client);
	done(null, client.id);
});
passport.deserializeUser(async (id, done) => {
	console.log(`inside deserialize`);
	console.log(`deserialize id ${id}`);

	try {
		const findUser = await User.findById(id);
		if (!findUser) throw new Error("User not found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
	new Strategy(async (username, password, done) => {
		try {
			const findUser = await User.findOne({ username: username });
			if (!findUser) throw new Error("User not found");
			if (!comparePassword(password, findUser.password))
				throw new Error("Bad Credentials");
			done(null, findUser);
		} catch (err) {
			done(err, null);
		}
	})
);
