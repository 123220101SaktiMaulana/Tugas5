import express from "express";
import cors from "cors";
import { json } from "sequelize";
import router from "./routes/NoteRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(5000, ()=> console.log('server up and running'));