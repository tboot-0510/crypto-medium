import React, { useState } from "react";
import MetaBar from "../components/metabar/MetaBar";
import TextareaAutosize from "react-textarea-autosize";

import styles from "./write.module.scss";
import { makePostApiHandler } from "../api/postApi";

const INITIAL_POST_DATA = {
  title: "",
  markdown: "",
  tags: "",
};

const Write = () => {
  const [post, setPost] = useState(INITIAL_POST_DATA);

  const makePost = () => {
    makePostApiHandler(post);
  };

  return (
    <div className="f fd-c h-100-p" style={{ minHeight: "100vh" }}>
      <MetaBar
        disabled={!(post.title.length > 6 && post.markdown.length > 15)}
        onClick={() => makePost()}
      />
      <div className={styles["section-content"]}>
        <div className="f fd-c ai-c w-80 mb-48 mt-12">
          <TextareaAutosize
            autoFocus={true}
            onChange={(e) => {
              // setLocalDraft((prev) => ({ ...prev, title: e.target.value }));
              setPost((prev) => {
                return { ...prev, title: e.target.value };
              });
            }}
            value={post.title}
            placeholder="Title"
            style={{
              width: "100%",
              fontSize: "45px",
              border: "none",
              outline: "transparent",
              resize: "none",
              backgroundColor: "white",
              color: "black",
            }}
          />
          <TextareaAutosize
            onChange={(e) => {
              // setLocalDraft((prev) => ({ ...prev, markdown: e.target.value }));
              setPost((prev) => {
                return { ...prev, markdown: e.target.value };
              });
            }}
            value={post.markdown}
            className="hide_scroll"
            placeholder="Tell your story..."
            style={{
              marginTop: "8px",
              width: "100%",
              fontSize: "20px",
              border: "none",
              outline: "transparent",
              resize: "none",
              backgroundColor: "white",
              color: "black",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Write;
