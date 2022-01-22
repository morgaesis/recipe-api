//import * as dotenv from "dotenv";
import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import recipeRouter from "./routes/recipe";
import { connectToDatabase } from "./services/database";

dotenv.config()
if (!process.env.PORT) {
	console.log("No PORT specified in environment variables")
	process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Express = express();
connectToDatabase()
	.then(() => {
		app.use(helmet());
		app.use(cors());
		app.use(express.json());
		app.use("/", recipeRouter);
		app.listen(PORT, () => {
			console.log(`Running on port ${PORT}`);
		});
	});
