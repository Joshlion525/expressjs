export const createUsersValidationSchema = {
	username: {
		isLength: {
			options: {
				min: 5,
				max: 32,
			},
			errorMessage:
				"Username must be at least 5 characters with max of 32 characters",
		},
		notEmpty: {
			errorMessage: "Username cannot be empty",
		},
		isString: {
			errorMessage: "Username must be a string",
		},
	},
	displayName: {
		isLength: {
			options: {
				min: 5,
				max: 10,
			},
			errorMessage:
				"displayname must be at least 5 characters with max of 10 characters",
		},
		notEmpty: true,
		isString: true,
	},
	password: {
		notEmpty: true,
	},
};

export const getUsersValidationSchema = {
	filter: {
		isString: true,
		notEmpty: {
			errorMessage: "Must not be empty",
		},
		isLength: {
			options: {
				min: 3,
				max: 10,
			},
			errorMessage: "Must be at least 3-10 characters",
		},
	},
};

export const getClientsValidation = {
	username: {
		isLength: {
			options: {
				min: 5,
				max: 10,
			},
			errorMessage:
				"Username must be at least 5 characters with max of 10 characters",
		},
		notEmpty: {
			errorMessage: "Username cannot be empty",
		},
		isString: {
			errorMessage: "Username must be a string",
		},
	},
	password: {
		isLength: {
			min: 5,
			max: 10,
		},
		errorMessage:
			"Password must be at least 5 characters with max of 10 characters",
	},
	notEmpty: true,
	isString: true,
};

export const cartItemSchema = {
	name: {
		in: ["body"],
		isString: true,
		notEmpty: true,
		errorMessage: "Item name is required and must be a string.",
	},
	price: {
		in: ["body"],
		isFloat: { options: { min: 0.01 } },
		errorMessage: "Price is required and must be a positive number.",
	},
	quantity: {
		in: ["body"],
		isInt: { options: { min: 1 } },
		errorMessage:
			"Quantity is required and must be an integer greater than 0.",
	},
};
