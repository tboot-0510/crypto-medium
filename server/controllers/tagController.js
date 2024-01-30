import Tag from "../models/tag.js";

// TO-DO pagination
const getTags = async () => {
  const tags = await Tag.find();

  return { tags };
};

const updateTags = async (req) => {
  console.log("tags", req.body);
};

export { getTags, updateTags };
