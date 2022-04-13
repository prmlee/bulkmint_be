import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';

const get = async (req: Request, res: Response, next: () => void) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required().label('id'),
    });
    const { error } = schema.validate(req.params);
    if (error) {
      res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ message: error.details[0].message });
      return;
    }
    next();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};

export const TokenValidator = { get };
