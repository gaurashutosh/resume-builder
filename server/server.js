import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import userRouter from "./routes/user.route.js";
import resumeRouter from "./routes/resume.route.js";
import aiRouter from "./routes/ai.route.js";

dotenv.config({ path: "./.env" });

const app = express();

await connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
