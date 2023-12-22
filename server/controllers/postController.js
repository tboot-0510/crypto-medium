import Post from "../models/post.js";

const writePost = async (req, res) => {
  try {
    const { post } = req.body;
    const postRef = new Post({
      ...post,
      tags: "blockchain",
      userId,
      image: imgUrl,
      summary,
    });
    const newPost = await postRef.save();
    res.status(200).send(newPost);
  } catch (err) {
    console.log("[ERROR]", err);
    res.status(500).json({ message: err.message });
  }
};

export { writePost };
