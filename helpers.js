import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "./index.js";
import { ObjectId } from "mongodb";

async function generateHashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function generateJwtToken(email) {
  return await jwt.sign({ email: email }, process.env.JWT_SKEY);
}
async function getUserByEmail(email) {
  return await client
    .db("organization")
    .collection("users")
    .findOne({ email: email });
}

async function updateCustomerById(id, req) {
  delete req.body._id;

  return await client
    .db("organization")
    .collection("customers")
    .updateOne({ _id: ObjectId(id) }, { $set: req.body });
}
async function deleteCustomerById(id) {
  return await client
    .db("organization")
    .collection("customers")
    .deleteOne({ _id: ObjectId(id) });
}
async function getCustomerById(id) {
  return await client
    .db("organization")
    .collection("customers")
    .findOne({ _id: ObjectId(id) });
}
export {
  generateHashedPassword,
  getUserByEmail,
  generateJwtToken,
  updateCustomerById,
  deleteCustomerById,
  getCustomerById,
};
