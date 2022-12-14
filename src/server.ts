import cors from "cors";
import express, { Response } from "express";

import { router } from "./routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.get("/", (_, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
