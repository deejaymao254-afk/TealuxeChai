import express from "express";
import adminRoutes from "./adminRoutes.js";

const app = express();

app.use(express.json());

// your existing routes
// app.use("/users", usersRouter);

app.use("/admin", adminRoutes); // ✅ THIS is correct

app.listen(5001, () => {
  console.log("Server running on port 5000");
});