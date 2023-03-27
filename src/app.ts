import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { connectDB } from "./config/connectDB";
import { errorHandlerMidlleware } from "./middlewares/errorHandlerMiddleware";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(morgan("dev"));

// ROUTES
app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Server Alive : Express Ts" });
});

// 404 MIDDLEWARE
app.use(notFoundMiddleware);
// ERROR MIDDLEWARE
app.use(errorHandlerMidlleware);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: err.message,
      status,
    },
  });
});

const start = async () => {
  const port = process.env.PORT || 5001;
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server alive: ${port}`);
    });
  } catch (error) {
    console.log("Something went wrong");
  }
};
start();
