import express from "express";
import {
  getAllClients,
  getClientById,
  updateClientById,
  createNewClient,
  deleteClientById,
} from "../controllers/clients-controller.js";

const router = express.Router();

// Get all clients
router.get("/", getAllClients);

// Get single client by id
router.get("/:id", getClientById);

// Updated single client by id
router.put("/:id", updateClientById);

// Create new client
router.post("/", createNewClient);

// Delete client by ID
router.delete("/:id", deleteClientById);

export default router;
