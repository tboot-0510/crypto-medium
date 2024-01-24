import { truncateMarkdown } from "../helpers/fomat_string.js";
import { errorWithStatusCode } from "../middelware/error_handler.js";
import cryptoPayment from "../models/crypto_payment.js";
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

const getPost = async (req) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw errorWithStatusCode(404, {
        message: `No post with id: ${req.params.id}`,
      });
    }

    if (!post.membersOnly)
      return {
        post: {
          ...post._doc,
          isLocked: false,
        },
      };

    const payment = await cryptoPayment.findOne({ post: req.params.id });

    if (payment) {
      return {
        post: {
          ...post._doc,
          isLocked: false,
        },
      };
    }

    const { markdown } = post;

    return {
      post: {
        ...post._doc,
        markdown: truncateMarkdown(markdown),
        isLocked: true,
      },
    };
  } catch (err) {
    console.log("[ERROR]", err);
    throw errorWithStatusCode(500, { message: err.message });
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
