import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser';

const app = express();

// middleware 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended : true , limit: "16kb"}))
app.use(express.static("public"));

// writing routes 

import { router } from '../routes/User.route.js';

app.use("/api/v1/users", router)

export default app;