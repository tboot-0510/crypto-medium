import { truncateMarkdown } from "../helpers/fomat_string.js";
import { errorWithStatusCode } from "../middelware/error_handler.js";
import cryptoPayment from "../models/crypto_payment.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import Tag from "../models/tag.js";

const writePost = async (req) => {
  try {
    const { post } = req.body;

    console.log("post", post);

    const postRef = new Post({
      ...post,
      userId: req.userId,
      image: "",
    });
    const newPost = await postRef.save();
    Promise.all(
      newPost.tags.map(async (tag) => {
        const isTag = await Tag.findOne({ name: tag });
        if (!isTag) await new Tag({ name: tag }).save();
      })
    );
    return { newPost };
  } catch (err) {
    throw errorWithStatusCode(500, { message: err.message });
  }
};

const getPost = async (req) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      select: "username name walletAccount",
      populate: {
        path: "walletAccount",
        select: "externalAccountId",
      },
    });
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
          isClapped: post.votes.includes(req.userId),
        },
      };

    const payment = await cryptoPayment.findOne({ post: req.params.id });

    if (payment) {
      return {
        post: {
          ...post._doc,
          isLocked: false,
          isClapped: post.votes.includes(req.userId),
        },
      };
    }

    const { markdown } = post;

    const isCurrentUser = post.userId._id.toString() === req.userId;

    return {
      post: {
        ...post._doc,
        markdown: isCurrentUser ? markdown : truncateMarkdown(markdown),
        isLocked: !isCurrentUser,
        isClapped: post.votes.includes(req.userId),
      },
    };
  } catch (err) {
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
    res.status(500).json({ message: error.message });
  }
};

const getPostVotes = async (req) => {
  if (!req.params.id) {
    throw errorWithStatusCode(404, {
      message: `No post with id: ${req.params.id}`,
    });
  }
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw errorWithStatusCode(404, {
      message: `No post with id: ${req.params.id}`,
    });
  }

  if (post.userId.toString() === req.userId) {
    throw errorWithStatusCode(403, {
      message: `Can not clap it's own post: ${req.params.id}`,
    });
  }

  // if (post.votes.includes(req.userId)) {
  //   throw errorWithStatusCode(400, {
  //     message: `User has already clapped for post: ${req.params.id}`,
  //   });
  // }

  post.votes.push(req.userId);

  const updatedPost = await post.save();

  // TO-DO send notification to author of post
  return {
    votes: {
      count: updatedPost.votes.length,
      isClapped: updatedPost.votes.includes(req.userId),
    },
  };
};

export async function getPostsWithUser(q) {
  const posts = await q.sort({ _id: -1 });
  return Promise.all(
    posts.map(async (post) => {
      const user = await User.findOne({ _id: post.userId });
      return { post, user };
    })
  );
}

export { writePost, getPost, getPosts, getPostVotes };
