import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
	username: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
	displayName: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
});

export const User = mongoose.model("User", UsersSchema);
