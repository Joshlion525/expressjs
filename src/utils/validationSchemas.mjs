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
		notEmpty: true,
	},
};

export const getUsersValidationSchema = {
	filter: {
		isString: true,
		notEmpty: {
			errorMessage: "Must nt be empty",
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
