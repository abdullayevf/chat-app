import "module-alias/register";
import express from "express";
import * as dotenv from "dotenv";
import authRoutes from "@/routes/auth.routes";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
})

app.use("/api/auth", authRoutes);


app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
