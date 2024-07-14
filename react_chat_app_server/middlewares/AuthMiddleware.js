import jwt from "jsonwebtoken";

export const verifyAuthToken = (request, response, next) => {
  const token = request.cookies.authToken;
  if (!token) {
    return response
      .status(401)
      .send("You are not authorized to access this URL");
  }
  jwt.verify(token, process.env.JWT_ENCRYPTION_KEY, async (err, payload) => {
    if (err) return response.status(403).send("Invalid Token");
    request.userId = payload.userID;
    next();
  });
};
