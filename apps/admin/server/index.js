import productsRouter from "./productsRouter.js";
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/products", productsRouter);