import Tag from "../models/tag.js";
import User from "../models/user.js";

// TO-DO pagination
const getTags = async () => {
  const tags = await Tag.find();

  return { tags };
};

const updateTags = async (req) => {
  const { tags } = req.body;
  const { userId } = req.params;

  const user = await User.findById({ _id: userId });
  if (!user) {
    throw errorWithStatusCode(404, {
      message: `No user with id: ${req.userId}`,
    });
  }
  Promise.all(
    tags.map(async (tag) => {
      const isTag = await Tag.findOne({ name: tag });
      if (!isTag) return;
      user.interests.push(isTag);
    })
  );
  await user.save();
  return;
};

export { getTags, updateTags };
