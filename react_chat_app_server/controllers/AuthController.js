import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import { errorHandler } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const expiryDuration = 3 * 24 * 60 * 60 * 1000;
const generateToken = (email, userID) => {
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

    const user = await User.create({ email, password });

    const authToken = generateToken(user.email, user._id);

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

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(errorHandler(400, "Email and Password fields are required"));
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(errorHandler(404, "User does not exists with this email"));
    }

    const isPasswordValid = await compare(password, existingUser.password);

    if (!isPasswordValid) {
      return next(errorHandler(400, "Password does not match"));
    }

    const authToken = generateToken(existingUser.email, existingUser._id);

    // Set the token in a cookie
    response.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      maxAge: expiryDuration,
      sameSite: "None",
    });

    response.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        image: existingUser.image,
        color: existingUser.color,
        profileSetup: existingUser.profileSetup,
      },
    });
  } catch (error) {
    next(error);
  }
};