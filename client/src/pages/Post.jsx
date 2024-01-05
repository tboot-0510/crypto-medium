import React from "react";
import PostAuthor from "../components/postAuthor/PostAuthor";
import { useQuery } from "@tanstack/react-query";
import { getPostIdApiHandler } from "../api/postApi";
import { useParams } from "react-router-dom";
import { starIcon } from "../assets/icons";

import styles from "./post.module.scss";
import NavBar from "../components/navbar/NavBar";
import { useSelector } from "react-redux";
import { toUppercase } from "../utils/format";
import CallToAction from "../reusable-elements/CallToAction/CallToAction";
import { useModalContext } from "../context/ModalProvider";
import UnlockPostModal from "../components/layout/UnlockPostModal";

const Post = () => {
  const { id } = useParams();

  const { userName } = useSelector((state) => ({
    userName: state.user.informations.name,
  }));

  const { openModal } = useModalContext();

  const { data } = useQuery({
    queryKey: ["getPostIdApiHandler", id],
    queryFn: ({ queryKey }) => getPostIdApiHandler(queryKey[1]),
  });

  const { title, markdown, createdAt, userId, membersOnly } = data?.data || [];

  const unlockPost = () => {
    openModal({
      contentElement: <UnlockPostModal />,
    });
  };

  return (
    <>
      <NavBar />

      <div className="f jc-c h-100-p" style={{ minHeight: "100vh" }}>
        <div className={styles["post"]}>
          <div className="mt-32" />
          {membersOnly && (
            <div className="f fd-r mb-12">
              <div className="f ai-c mr-8">{starIcon}</div>
              <p className="f fd-r">
                <span>Members only</span>
              </p>
            </div>
          )}
          <h1 className={styles["post-title"]}>{title}</h1>
          <PostAuthor userId={userId} createdAt={createdAt} />
          <div className="mt-24">{markdown}</div>
          {membersOnly && (
            <div className="f jc-c ai-c">
              <div className={styles["post-fade-away"]} />
              <div className={styles["post-upgrade"]}>
                <h2 className={styles["post-upgrade-title"]}>
                  {toUppercase(userName)}, read the best stories from industry
                  leaders on Medium.
                </h2>
                <div className="mt-32">
                  <p>
                    The author made this story available
                    to&nbsp;Medium&nbsp;members&nbsp;only.
                    Upgrade&nbsp;to&nbsp;instantly unlock&nbsp;this&nbsp;story
                    plus other&nbsp;member-only&nbsp;benefits.
                  </p>
                </div>
                <div className="f fd-r jc-c g-8 mt-32">
                  <CallToAction
                    // onClick={publishPost}
                    type="primary"
                    message="Upgrade"
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
                  <CallToAction
                    onClick={unlockPost}
                    type="primary"
                    message="Unlock now"
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
          )}
        </div>
      </div>
    </>
  );
};

export default Post;
