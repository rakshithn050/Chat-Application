import User from "../models/UserModel.js";
import { errorHandler } from "../utils/ErrorHandler.js";

export const getContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.trim() === ""
    ) {
      return next(errorHandler(400, "Search term is required"));
    }

    const sanitizedSearchTerm = searchTerm
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return response.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};
