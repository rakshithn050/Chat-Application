import User from "../models/UserModel";
import { errorHandler } from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";

const expiryDuration = 3 * 24 * 60 * 60 * 1000;
const token = (email, userID) => {
  return jwt.sign({ email, userID }, process.env.JWT_ENCRYPTION_KEY, {
    expiresIn: expiryDuration,
  });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(errorHandler(400, "Email and Password fields are required"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists with this email"));
    }

    const user = await User.create({ email, password: hashedPassword });

    const authToken = token(user.email, user._id);

    // Set the token in a cookie
    response.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      maxAge: expiryDuration,
      sameSite: "None",
    });

    response.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    next(error);
  }
};
