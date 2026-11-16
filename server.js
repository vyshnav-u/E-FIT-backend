
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

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(router);
app.use(workoutRouter);
app.use("/", weightRoutes);
app.use(dietRoutes);
app.use(foodRoutes);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(3000, () => {
            console.log("Server started");
        });

    } catch (err) {
        console.log("Server Startup Failed", err);
    }
};

startServer();
