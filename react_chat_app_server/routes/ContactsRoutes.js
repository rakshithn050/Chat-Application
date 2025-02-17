import { Router } from "express";
import {
  getContacts,
  getContactsForMessages,
  getAllContacts,
} from "../controllers/ContactsController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/getContacts", verifyAuthToken, getContacts);
router.get("/getContactsForMessages", verifyAuthToken, getContactsForMessages);
router.get("/getAllContacts", verifyAuthToken, getAllContacts);

export default router;
