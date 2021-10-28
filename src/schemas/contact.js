const Joi = require('joi');
const { validate: isRut } = require('rut.js');

// Custom joi validator
const rutValidator = (value) => {
  if (isRut(value)) {
    return value;
  }
  throw new Error('Invalid format');
};

const schema = Joi.object({
  firstName: Joi.string().trim().min(3).max(15).required().messages({
    'string.base': 'El campo Nombre debe ser de tipo texto.',
    'string.empty': 'El campo Nombre no puede estar vacio.',
    'string.min': 'El minimo de catacteres para el campo Nombre es 3.',
    'string.max': 'El maximo de catacteres para el campo Nombre es 15.',
    'any.required': 'El campo Nombre es requerido.',
  }),
  lastName: Joi.string().trim().min(3).max(15).required().messages({
    'string.base': 'El campo Apellido debe ser de tipo texto.',
    'string.empty': 'El campo Apellido no puede estar vacio.',
    'string.min': 'El minimo de catacteres para el campo Apellido es 3.',
    'string.max': 'El maximo de catacteres para el campo Apellido es 15.',
    'any.required': 'El campo Apellido es requerido.',
  }),
  rut: Joi.string()
    .trim()
    .custom(rutValidator, 'custom validator for rut format')
    .required()
    .messages({
      'string.base': 'El formato del campo Rut es invalido.',
      'string.empty': 'El campo Rut no puede estar vacio.',
      'any.required': 'El campo Rut es requerido.',
      'any.custom': 'El formato del campo Rut es invalido.',
    }),
  phone: Joi.string().trim().length(9).required().messages({
    'string.base': 'El campo Telefono debe ser de tipo texto.',
    'string.empty': 'El campo Telefono no puede estar vacio.',
    'string.length': 'El campo Telefono acepta 9 catacteres.',
    'any.required': 'El campo Telefono es requerido.',
  }),
}).options({ abortEarly: false });

module.exports = schema;
