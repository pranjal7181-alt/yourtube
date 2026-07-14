import axios from "axios";

export const translateComment = async (req, res) => {
  const { text, target } = req.body;

  try {
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: "auto",
          tl: target,
          dt: "t",
          q: text,
        },
      }
    );

    const translatedText = response.data[0]
      .map((item) => item[0])
      .join("");

    return res.status(200).json({
      translatedText,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Translation failed",
    });
  }
};