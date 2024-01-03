import Post from "../models/post.js";

const writePost = async (req, res) => {
  try {
    const { post } = req.body;

    console.log("post", post);

    const postRef = new Post({
      ...post,
      userId: req.userId,
      image: "",
    });
    const newPost = await postRef.save();
    res.status(200).send(newPost);
  } catch (err) {
    console.log("[ERROR]", err);
    res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send({ message: `No post with id: ${req.params.id}` });
      return;
    }
    res.status(200).send(post);
  } catch (err) {
    console.log("[ERROR]", err);
    res.status(500).json({ message: err.message });
  }
};

const getPosts = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .populate("userId", "username name")
      .limit(limit);

    res.status(200).send(posts);
  } catch (error) {
    console.log("[ERROR]", error);
    res.status(500).json({ message: error.message });
  }
};

export { writePost, getPost, getPosts };
