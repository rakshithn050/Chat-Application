import { Router } from "express";
import { getContacts } from "../controllers/ContactsController.js";
import { verifyAuthToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/getContacts", verifyAuthToken, getContacts);

export default router;
