import { Router } from "express";
import { getContacts } from "../controllers/ContactsController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/getContacts", verifyAuthToken, getContacts);

export default router;
