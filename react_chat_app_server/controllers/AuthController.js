import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import { errorHandler } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { renameSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const getUserInfo = async (request, response, next) => {
  try {
    const { userId } = request;
    if (!userId) {
      return next(errorHandler(400, "You are not allowed to get this data."));
    }
    const userData = await User.findById(userId);
    if (!userData) {
      return next(errorHandler(404, "User not found"));
    }

    return response.status(200).json({
      message: "User info",
      userData: {
        id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
        profileSetup: userData.profileSetup,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (request, response, next) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;

    if (!firstName || !lastName || !color) {
      return next(
        errorHandler(
          400,
          "First name, last name, and color fields are required"
        )
      );
    }

    if (!userId) {
      return next(
        errorHandler(400, "You are not allowed to update this profile.")
      );
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return next(errorHandler(404, "User not found"));
    }

    return response.status(201).json({
      message: "User profile updated successfully",
      userData: {
        id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
        profileSetup: userData.profileSetup,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addUserProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;

    if (!userId) {
      return next(
        errorHandler(400, "You are not allowed to update this profile.")
      );
    }

    if (!request.file) {
      return next(errorHandler(400, "Profile Image is Missing."));
    }

    const date = Date.now();
    const fileName = `uploads/profiles/${date}${request.file.originalname
      .split(" ")
      .join("_")}`;
    const filePath = path.join(__dirname, fileName);

    // Rename the file
    renameSync(path.normalize(request.file.path), path.normalize(fileName));

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return next(errorHandler(404, "User not found"));
    }

    return response.status(201).json({
      message: "User profile image updated successfully",
      userData: {
        image: userData.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfileImage = async (request, response, next) => {
  try {
    const { userId, profileImage } = request;

    if (!userId) {
      return next(
        errorHandler(400, "You are not allowed to update this profile.")
      );
    }

    if (!request.file) {
      return next(errorHandler(400, "Profile Image is Missing."));
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        image: profileImage,
      },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return next(errorHandler(404, "User not found"));
    }

    return response.status(201).json({
      message: "User profile updated successfully",
      userData: {
        id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
        profileSetup: userData.profileSetup,
      },
    });
  } catch (error) {
    next(error);
  }
};
