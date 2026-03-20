import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // Get token from the headers
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adds the user ID to the request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};