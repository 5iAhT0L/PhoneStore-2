import express from "express";
import {
  loginHandler,
  registerHandler,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/auth/register", registerHandler);
authRouter.post("/auth/login", loginHandler);

export default authRouter;