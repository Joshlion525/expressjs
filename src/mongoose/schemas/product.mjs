import mongoose, { Schema } from "mongoose";

const ProductsSchema = new mongoose.Schema({
	name: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
	price: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
	quantity: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
});

export const Product = mongoose.model("Product", ProductsSchema);
