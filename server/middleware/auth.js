import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "token is missing or invalid. try again",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.json({ success: false, message: "decoded id not available" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.json({
      succcess: false,
      message: "token is correct but after that something is wrong",
    });
  }
};
export default userAuth;
