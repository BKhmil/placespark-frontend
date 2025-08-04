import Joi from 'joi';
import { regexConstant } from '../constants/regex.constants';

export class UserValidator {
	static name = Joi.string().min(3).max(50).trim().messages({
		'string.empty': 'validation.name_required',
		'string.min': 'validation.name_min',
		'string.max': 'validation.name_max',
	});
	static email = Joi.string().pattern(regexConstant.EMAIL).trim().messages({
		'string.empty': 'validation.email_required',
		'string.pattern.base': 'validation.email_pattern',
	});
	static password = Joi.string()
		.pattern(regexConstant.PASSWORD)
		.trim()
		.messages({
			'string.empty': 'validation.password_required',
			'string.pattern.base': 'validation.password_pattern',
		});
	// static role = Joi.string().valid(...Object.values(RoleEnum));
	static favorites = Joi.array().items(Joi.string());

	static signUp = Joi.object({
		email: this.email.required(),
		password: this.password.required(),
		name: this.name.required(),
	});

	static updateMe = Joi.object({
		name: this.name.optional(),
		favorites: this.favorites.optional(),
	});

	static signIn = Joi.object({
		email: this.email.required(),
		password: this.password.required(),
	});

	static forgotPassword = Joi.object({
		email: this.email.required(),
	});

	static accountRestore = Joi.object({
		email: this.email.required(),
	});

	static changePassword = Joi.object({
		newPassword: this.password.required(),
		oldPassword: this.password.required(),
	});
}
