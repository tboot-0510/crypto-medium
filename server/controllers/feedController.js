const BASE_URL =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/";

const TOPIC_TAG = "tag/";
const PUBLICATION_TAG = "publication-name/tagged/";

const fetchTopicData = async (req, res) => {
  try {
    const { tag } = req.body;
    const response = await fetch(`${BASE_URL}${TOPIC_TAG}${tag}`);
    const data = await response.json();
    res.status(200).send(data);
  } catch (err) {
    console.log("[ERROR]", err);
    res.status(500).json({ message: err.message });
  }
};

const fetchRecommendationData = async (req, res) => {
  try {
    const { user } = req.body;
    res
      .status(200)
      .send(["Blockchain", "Crypto", "AI", "Finance", "Books", "Programming"]);
  } catch (err) {
    console.log("[ERROR]", err);
    res.status(500).json({ message: err.message });
  }
};

export { fetchTopicData, fetchRecommendationData };
