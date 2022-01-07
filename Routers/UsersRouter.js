import { Router } from "express";
import { client } from "../index.js";
import bcrypt from "bcrypt";
import {
  generateHashedPassword,
  getUserByEmail,
  generateJwtToken,
} from "../helpers.js";

const router = Router();

router.route("/signup").post(async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await generateHashedPassword(password);

  const userDetails = await getUserByEmail(email);
  // Check user already present
  if (userDetails) {
    res.send({ message: "Account already exists" });
    return;
  }

  const createUserResponse = await client
    .db("organization")
    .collection("users")
    .insertOne({ ...req.body, password: hashedPassword });

  if (createUserResponse.acknowledged) {
    const token = await generateJwtToken(email);
    res.send({ message: "Signup Successfull", token: token });
  }
});

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  const userDetails = await getUserByEmail(email);
  // Check user already present
  if (!userDetails) {
    res.send({ message: "Account doesn't exists" });
    return;
  }
  // check password
  const passwordMatches = await bcrypt.compare(password, userDetails.password);
  const token = await generateJwtToken(email);
  if (passwordMatches) {
    res.send({ message: "Login Successful", token: token });
  } else {
    res.send({ message: "Invalid Credentials" });
  }
});

export const UsersRouter = router;
