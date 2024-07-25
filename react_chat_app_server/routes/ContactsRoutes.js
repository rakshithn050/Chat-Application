import { Router } from "express";
import {
  getContacts,
  getContactsForMessages,
} from "../controllers/ContactsController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/getContacts", verifyAuthToken, getContacts);
router.post("/getContactsForMessages", verifyAuthToken, getContactsForMessages);

export default router;
