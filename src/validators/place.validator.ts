import Joi from 'joi';
import { regexConstant } from '../constants/regex.constants';
import { PlaceWorkingDayEnum } from '../enums/place-working-day.enum';
import {
	OrderEnum,
	PlaceFeatureEnum,
	PlaceListOrderEnum,
	PlaceTypeEnum,
} from '../enums/place.enums';

export class PlaceValidator {
	static name = Joi.string().min(1).max(100).trim().messages({
		'string.empty': 'validation.name_optional',
		'string.min': 'validation.name_min',
		'string.max': 'validation.name_max',
	});
	static description = Joi.string().allow('').max(1000).trim();
	static address = Joi.string().min(5).max(200).trim().messages({
		'string.empty': 'validation.address_required',
		'string.min': 'validation.address_min',
		'string.max': 'validation.address_max',
	});
	static location = Joi.object({
		lat: Joi.number().messages({
			'number.base': 'validation.location_lat_number',
		}),
		lng: Joi.number().messages({
			'number.base': 'validation.location_lng_number',
		}),
	});

	// Валідатори для оновлення (опціональні)
	static nameUpdate = Joi.string()
		.min(1)
		.max(100)
		.trim()
		.allow('')
		.optional()
		.messages({
			'string.min': 'validation.name_min',
			'string.max': 'validation.name_max',
		});
	static addressUpdate = Joi.string()
		.min(5)
		.max(200)
		.trim()
		.allow('')
		.optional()
		.messages({
			'string.min': 'validation.address_min',
			'string.max': 'validation.address_max',
		});
	static locationUpdate = Joi.object({
		lat: Joi.alternatives()
			.try(Joi.number(), Joi.string().allow('').optional())
			.optional()
			.messages({
				'number.base': 'validation.location_lat_number',
			}),
		lng: Joi.alternatives()
			.try(Joi.number(), Joi.string().allow('').optional())
			.optional()
			.messages({
				'number.base': 'validation.location_lng_number',
			}),
	}).optional();
	static photo = Joi.string().allow('').trim();
	static tags = Joi.array().items(Joi.string()).max(4);
	static type = Joi.string()
		.valid(...Object.values(PlaceTypeEnum))
		.trim()
		.allow('')
		.messages({
			'string.empty': 'validation.type_optional',
		});
	static features = Joi.array().items(
		Joi.string()
			.valid(...Object.values(PlaceFeatureEnum))
			.allow(''),
	);
	static averageCheck = Joi.number().min(0);
	static contacts = Joi.object({
		phone: Joi.string()
			.pattern(regexConstant.PHONE_UA_REGEX)
			.allow('')
			.optional(),
		tg: Joi.string().pattern(regexConstant.TG_REGEX).allow('').optional(),
		email: Joi.string().pattern(regexConstant.EMAIL).allow('').optional(),
	}).optional();
	static workingHour = Joi.object({
		day: Joi.string()
			.valid(...Object.values(PlaceWorkingDayEnum))
			.required(),
		from: Joi.string()
			.pattern(regexConstant.REGEX_TIME_HH_MM)
			.allow('')
			.optional(),
		to: Joi.string()
			.pattern(regexConstant.REGEX_TIME_HH_MM)
			.allow('')
			.optional(),
		closed: Joi.boolean().optional(),
	});
	static workingHours = Joi.array().length(7).items(PlaceValidator.workingHour);

	static create = Joi.object({
		name: this.name.required(),
		description: this.description.optional(),
		address: this.address.required(),
		location: this.location.required(),
		photo: this.photo.optional(),
		tags: this.tags.optional(),
		type: this.type.required(),
		features: this.features.optional(),
		averageCheck: this.averageCheck.required(),
		contacts: this.contacts.optional(),
		workingHours: this.workingHours.required(),
	});

	static update = Joi.object({
		name: this.nameUpdate,
		description: this.description.optional(),
		address: this.addressUpdate,
		location: this.locationUpdate,
		photo: this.photo.optional(),
		tags: this.tags.optional(),
		type: this.type.optional(),
		features: this.features.optional(),
		averageCheck: this.averageCheck.optional(),
		contacts: this.contacts.optional(),
		workingHours: this.workingHours.optional(),
	}).min(1); // Мінімум одне поле має бути заповнене

	static getListQuery = Joi.object({
		limit: Joi.number().min(1).max(100).default(12),
		page: Joi.number().min(1).default(1),
		name: this.name.allow('').optional(),
		type: this.type.allow('').optional(),
		rating: Joi.number().min(0).optional(),
		averageCheckMin: Joi.number().min(0).optional(),
		averageCheckMax: Joi.number().min(0).optional(),
		tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
		features: Joi.alternatives().try(
			Joi.array().items(Joi.string().allow('')),
			Joi.string().allow(''),
		),
		isModerated: Joi.boolean().optional(),
		isDeleted: Joi.boolean().optional(),
		adminId: Joi.string().optional(),
		order: Joi.string()
			.valid(...Object.values(OrderEnum))
			.allow('')
			.default(OrderEnum.DESC)
			.messages({
				'string.empty': 'validation.order_optional',
			}),
		latitude: Joi.number().optional(),
		longitude: Joi.number().optional(),
		orderBy: Joi.string()
			.valid(...Object.values(PlaceListOrderEnum))
			.allow('')
			.default(PlaceListOrderEnum.CREATED_AT)
			.messages({
				'string.empty': 'validation.orderBy_optional',
			}),
	});
}
