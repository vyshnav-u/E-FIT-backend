
require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/db");
const router = require("./routes/authRoutes");
const workoutRouter = require("./routes/workoutRoutes");
const cors = require("cors");
const dietRoutes = require("./routes/dietRoutes");
const foodRoutes = require("./routes/foodRoutes");
const weightRoutes = require("./routes/weightRoutes");
const path = require("path");

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://e-fit-frontend.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "E/FIT Backend is running"
    });
});

app.use(router);
app.use(workoutRouter);
app.use("/", weightRoutes);
app.use(dietRoutes);
app.use(foodRoutes);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server started on port ${PORT}`);
        });

    } catch (err) {
        console.error("Server Startup Failed", err);
        process.exit(1);
    }
};

startServer();
