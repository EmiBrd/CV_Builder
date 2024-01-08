import mongoose from 'mongoose';

let userSchema: mongoose.Schema | null = null;

export const getUserSchema = (): mongoose.Schema => {
	if (!userSchema) {
		userSchema = new mongoose.Schema({
			username: {
				type: String,
				required: [ true, 'Please provide unique username' ],
				unique: [ true, 'This username exist' ]
				// validate: {
				// 	validator: function(value: string) {
				// 		return value.length >= 4;
				// 	},
				// 	message: 'Username must be at least 4 characters long'
				// }
			},
			password: {
				type: String,
				required: [ true, 'Please provide a password' ]
			},
			email: {
				type: String,
				required: [ true, 'Please provide unique email' ],
				unique: true
				// validate: {
				// 	validator: function(value: string) {
				// 		// - ^ asserts the start of the string.
				// 		// - [\w-\.]+ matches one or more word characters, hyphens, or periods (the username part of the email).
				// 		// - @ matches the "@" symbol.
				// 		// - ([\w-]+\.)+ matches one or more occurrences of word characters and hyphens followed by a period (the domain name part of the email).
				// 		// - [\w-]{2,4} matches between 2 and 4 word characters (the top-level domain part of the email).
				// 		// - $ asserts the end of the string.
				// 		return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
				// 	},
				// 	message: 'Please provide a valid email address'
				// }
			},
			firstName: {
				type: String
				// validate: {
				// 	validator: function(value: string) {
				// 		return value.length >= 2;
				// 	},
				// 	message: 'First name must be at least 2 characters long'
				// }
			},
			lastName: {
				type: String
				// validate: {
				// 	validator: function(value: string) {
				// 		return value.length >= 2;
				// 	},
				// 	message: 'Last name must be at least 2 characters long'
				// }
			},
			mobile: {
				type: String,
				unique: true,
				validate: {
					validator: function(value: string) {
						return value.length >= 7 && value.length <= 15;
					},
					message: 'Phone number length must be at least 7 and at most 15 characters long'
				}
			},
			address: {
				type: String
				// validate: {
				// 	validator: function(value: string) {
				// 		return value.length >= 2;
				// 	},
				// 	message: 'Address must be at least 2 characters long'
				// }
			},
			profileImage: { type: String }
		});
	}
	return userSchema;
};

export default mongoose.model('CV_Template', getUserSchema());
