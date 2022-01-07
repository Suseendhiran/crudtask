import { client } from "../index.js";
import express from "express";
import { auth } from "../Middleware/auth.js";
import {
  updateCustomerById,
  deleteCustomerById,
  getCustomerById,
} from "../helpers.js";

const router = express.Router();

router
  .route("/:id")
  .get(auth, async (req, res) => {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    if (customer) {
      res.send(customer);
    } else {
      res.status(404).send({ message: "No Customer found" });
    }
  })
  .put(auth, async (req, res) => {
    const { id } = req.params;
    const response = await updateCustomerById(id, req);
    //if changed
    if (response.acknowledged) {
      let updated = await getCustomerById(id);

      res.send({
        customer: updated,
        message: "Customer updated",
      });
    } else {
      res.send({ message: "Error!" });
    }
  })
  .delete(auth, async (req, res) => {
    const { id } = req.params;
    const response = await deleteCustomerById(id);

    if (response.acknowledged) {
      res.send({
        message: "Customer deleted",
      });
      return;
    }
    res.send({ message: "Something went wrong" });
  });
router
  .route("/")
  .get(auth, async (req, res) => {
    const customers = await client
      .db("organization")
      .collection("customers")
      .find({})
      .toArray();
    customers.length
      ? res.send(customers)
      : res.status(404).send({ message: "No customers found" });
  })
  .post(auth, async (req, res) => {
    const data = req.body;
    const response = await client
      .db("organization")
      .collection("customers")
      .insertOne(data);

    if (response.acknowledged) {
      res.send({ status: true, message: "Customer Added" });
    }
  });

export const CustomersRouter = router;
