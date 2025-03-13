import jwt from "jsonwebtoken";

// ✅ Middleware: Protect private routes
const isAuthenticated = (req, res, next) => {
  try {
    console.log("🔍 Checking authentication...");

    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1].trim()
      : null;

    const tokenFromCookie = req.cookies?.token?.trim();

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      console.error("❌ No authentication token found.");
      return res.status(401).json({ message: "User not authenticated." });
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      console.error("❌ Missing JWT_SECRET_KEY in environment.");
      return res.status(500).json({ message: "Server misconfiguration." });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.userId) {
      console.error("❌ Invalid token: missing userId.");
      return res.status(401).json({ message: "Invalid token." });
    }

    req.userId = decoded.userId;
    console.log("✅ Authenticated user:", req.userId);
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ Optional: Check auth status via endpoint (client-side auth sync)
export const checkIsAuthenticated = (req, res) => {
  try {
    console.log("🔍 Checking authentication status...");

    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1].trim()
      : null;

    const tokenFromCookie = req.cookies?.token?.trim();
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      console.warn("❌ No token provided.");
      return res.status(401).json({ message: "Not authenticated." });
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      console.error("❌ JWT_SECRET_KEY not defined.");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.userId) {
      console.warn("❌ Invalid token: userId missing");
      return res.status(401).json({ message: "Invalid token." });
    }

    console.log("✅ Auth check passed for user:", decoded.userId);
    return res.status(200).json({
      message: "Authenticated",
      userId: decoded.userId,
    });
  } catch (error) {
    console.error("❌ Auth check error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default isAuthenticated;
