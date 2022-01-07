// Write a Node API application to implement CRUD of Organizations

// needed endpoints POST, PUT, GET, DELETE,

// collections
// organizations
// users with roles & privileges under the organization
// secure the api with passport

// use relationships

// use migrations

// use seeds

// use factories

// create a basic blade,
// login
// signup
// data table to view organization & user data with relations based on privileges /roles
// availalbe privileges,
// admin
// user
// Admin can view all data, both users & organisations
// user can view on

import express from "express";
import { UsersRouter } from "./Routers/UsersRouter.js";
import { CustomersRouter } from "./Routers/CrudsRouter.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.listen(3000);
app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect().then(() => console.log("Mongo connected"));
  return client;
}

export const client = await createConnection();

app.get("/", (req, res) => {
  res.send("started");
});

app.use("/users", UsersRouter);
app.use("/customers", CustomersRouter);
