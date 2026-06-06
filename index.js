import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import "dotenv/config";
import session from "express-session";
import ModulesRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentsRoutes from './Kambaz/Enrollments/routes.js';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);

const app = express()

const allowedOrigins = [
  process.env.CLIENT_URL?.trim(),
  "http://localhost:3000",
  "https://kambaz-next-js-c4550-seamus-tqbl.vercel.app",
  "https://kambaz-next-js-c45550-seamus-tqbl.vercel.app",
];

console.log("CLIENT_URL =", JSON.stringify(process.env.CLIENT_URL));
console.log("ALLOWED ORIGINS =", allowedOrigins);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      console.log("REQUEST ORIGIN =", JSON.stringify(origin));
      console.log("ORIGIN ALLOWED =", allowedOrigins.includes(origin));

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {}
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
} else {
  sessionOptions.cookie = {
    sameSite: "lax",
    secure: false
  };
}

app.use(session(sessionOptions));
app.use(express.json())

Hello(app)
UserRoutes(app, db)
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5(app)

const port = process.env.PORT || 4000
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})