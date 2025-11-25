import * as authServices from "../services/authServices.js";

export const registerHandler = async (req, res, next) => {
  try {
    const Response = await authServices.register(req.body);

    res.status(201).json({
      message: "User registered successfully",
      data: Response,
    });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    const response = await authServices.login(req.body);

    res.status(200).json({
      message: "Login successful",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};