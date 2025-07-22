import Credit from "../models/Credit.js";

export const getCreditsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const creditData = await Credit.findOne({ _id: movieId });

    if (!creditData) {
      return res.status(404).send({ success: false, message: "Credits not found." });
    }
    res.send({ success: true, creditData });
  } catch (err) {
    console.error("❌ Error fetching credits:", err);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
};
