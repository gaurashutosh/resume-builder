import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB.js";

dotenv.config({ path: "./.env" });

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});