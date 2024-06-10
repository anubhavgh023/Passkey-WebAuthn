import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import connectDb from "./db/db-config.js";
import userRouter from "./routes/user.route.js";

// Import .env  
dotenv.config({
  path: '.env'
})

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors())
app.use(express.json());

// Connect Database
connectDb(process.env.MONGODB_URI);

// Routes
app.use("/api/user", userRouter);


app.listen(PORT, () => {
    console.log(`server running on PORT: ${PORT}`);
})