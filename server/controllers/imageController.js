import userModel from "../models/UserModel.js";
import FormData from "form-data";
import axios from "axios";
export const generateImage = async (req, res) => {
  const userId = req.userId;
  const { prompt } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user || !prompt) {
      return res.json({ success: false, message: "User or Prompt missing" });
    }
    if (!user || user.creditBalance < 0 || user.creditBalance == 0) {
      return res.json({
        success: false,
        message: "Insufficient credit. Please recharge.",
        creditBalance: user.creditBalance,
      });
    }
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_APIKEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });
    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log("error:", error.message);
    res.json({
      success: false,
      message: "Something went wrong after fetching user and prompt",
    });
  }
};
