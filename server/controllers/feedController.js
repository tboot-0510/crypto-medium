import { errorWithStatusCode } from "../middelware/error_handler.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Tag from "../models/tag.js";
import { getPostsWithUser } from "./postController.js";

const BASE_URL =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/";

const TOPIC_TAG = "tag/";
const PUBLICATION_TAG = "publication-name/tagged/";

const getRSSTagTopics = async (req) => {
  try {
    const { tag } = req.body;
    const response = await fetch(`${BASE_URL}${TOPIC_TAG}${tag}`);
    const data = await response.json();
    return { data };
  } catch (err) {
    throw errorWithStatusCode(500, { message: err.message });
  }
};

const getTagRecommendations = async (req) => {
  try {
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      throw errorWithStatusCode(404, {
        message: `No user with id: ${req.userId}`,
      });
    }

    const tags = await Tag.find({ name: { $nin: user.interests } }, { name: 1 })
      .sort({ _id: -1 })
      .limit(6);

    const defaultTags = [
      "Blockchain",
      "Crypto",
      "AI",
      "Finance",
      "Books",
      "Programming",
    ];

    if (tags.length < defaultTags.length) {
      return {
        defaultTags,
      };
    }
    return { tags };
  } catch (err) {
    throw errorWithStatusCode(500, { message: err.message });
  }
};

const getSuggestionPosts = async (req) => {
  try {
    const { userId } = req;
    const user = await User.findById({ _id: userId });

    if (!user) {
      throw errorWithStatusCode(404, {
        message: `No user with id: ${req.userId}`,
      });
    }

    const ignoredPosts = user?.ignoredPosts ?? [];
    const ignoredAuthors = user?.ignoredAuthors ?? [];
    const posts = await getPostsWithUser(
      Post.find({
        $and: [
          { userId: { $ne: userId } },
          { _id: { $nin: ignoredPosts } },
          { userId: { $nin: ignoredAuthors } },
        ],
      })
        .sort({ votes: -1 })
        .limit(3)
    );
    return { posts };
  } catch (err) {
    throw errorWithStatusCode(500, { message: err.message });
  }
};

export { getRSSTagTopics, getTagRecommendations, getSuggestionPosts };
