import * as Joi from '@hapi/joi'

export const ConfigValidationSchema = Joi.object({
	STAGE: Joi.string().required(),
	DB_PORT: Joi.number().default(5432).required(),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_DATABASE: Joi.string().required(),
	JWT_SECRET: Joi.string().required(),
})
