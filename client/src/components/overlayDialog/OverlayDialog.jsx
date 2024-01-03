import React, { useState } from "react";
import styles from "./overlayDialog.module.scss";
import { useSelector } from "react-redux";
import { splitString, toUppercase } from "../../utils/format";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { makePostApiHandler } from "../../api/postApi";
import { useNavigate } from "react-router-dom";
import { useOverlayContext } from "../../context/OverlayProvider";

const OverlayDialog = ({ post }) => {
  const image = "";

  const { userName } = useSelector((state) => ({
    userName: state.user.informations.name,
  }));

  const { closeOverlay } = useOverlayContext();

  const navigate = useNavigate();

  const [tags, setTags] = useState("");
  const [membersOnly, setMembersOnlyValue] = useState(false);

  const { title, markdown } = post;

  const handleTagChange = (e) => {
    setTags(splitString(e.target.value));
  };

  const publishPost = () => {
    makePostApiHandler({ ...post, tags, membersOnly: membersOnly }).then(
      (resp) => {
        console.log("resp", resp);
        if (resp) {
          closeOverlay();
          navigate(`/post/${resp.data._id}`);
          return;
        }
      }
    );
  };

  return (
    <div className={styles["overlay-dialog"]}>
      <div className="f fd-r">
        <div className={styles["overlay-dialog-column"]}>
          <p className="mb-12">
            <b className={styles["overlay-title"]}>Story Preview</b>
          </p>
          <div className={styles["overlay-image-preview"]}>
            {image ? (
              <img
                src={image}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="img"
              />
            ) : (
              <p style={{ width: "70%", fontSize: "14px", lineHeight: "22px" }}>
                Include a high-quality image in your story to make it more
                inviting to readers.
              </p>
            )}
          </div>
          <p className={styles["overlay-title-preview"]}>{title}</p>
          <p className={styles["overlay-subtitle-preview"]}>
            {markdown.length > 112 ? markdown.slice(0, 112) + " ..." : markdown}
          </p>
          <p className={styles.caption}>
            <b>Note:</b> Changes here will affect how your story appears in
            public places like Medium’s homepage and in subscribers’ inboxes —
            not the contents of the story itself.
          </p>
        </div>
        <div className={styles["overlay-dialog-column"]}>
          <p className="mb-12">
            Publishing to:{" "}
            <b className={styles["overlay-title"]}>
              <span style={{ color: "rgb(61 61 61)" }}>
                {toUppercase(userName)}
              </span>
            </b>
          </p>
          <p style={{ color: "gray" }}>
            <span className={styles["overlay-subtitle"]}>
              Add or change topics (up to 5) so readers know what your story is
              about. Separate them with commas.
            </span>
          </p>
          <input
            className={styles["overlay-tags-input"]}
            onChange={(e) => {
              handleTagChange(e);
            }}
            type="text"
            placeholder="Add a topic..."
          />
          <div className="mb-24" style={{ fontSize: "14px" }}>
            <a
              className="link link--underline u-baseColor--link"
              href="https://help.medium.com/hc/en-us/articles/360018677974"
              target="_blank"
              rel="noreferrer"
            >
              Learn more
            </a>{" "}
            about what happens to your post when you publish.
          </div>
          <div className="mb-12">
            <input
              type="checkbox"
              id="members-only"
              name="members-only"
              value="Checked"
              onChange={() => setMembersOnlyValue(!membersOnly)}
            />
            <label htmlFor="members-only">
              Only accessible for members only
            </label>
          </div>
          <CallToAction
            onClick={publishPost}
            type="primary"
            message="Publish now"
            additionalStyle={{
              backgroundColor: "#1a8917",
              height: "37px",
              padding: "0 16px",
              border: "1px solid rgba(0,0,0,.15)",
              borderRadius: "99em",
              width: "fit-content",
              fontSize: "13px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OverlayDialog;
