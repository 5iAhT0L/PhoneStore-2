import express from "express";
import { testConection } from "./config/db.js";
// import userRouter from "./routes/usersRouter.js";
// import productRouter from "./routes/productsRouter.js";
import authRouter from "./routes/authRouter.js";
import cors from "cors";
import { errorMiddleware } from "./errorMiddlewares/errorMiddleware.js";

const app = express();
app.use(cors());

const PORT = 3000;
app.use(express.json());

// app.use(userRouter);
app.use(authRouter);
// app.use(productRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  testConection();
});
