import React, { useEffect, useState } from "react";
import { formatDateTime, generateIcon, toUppercase } from "../../utils/format";
import { useQuery } from "@tanstack/react-query";
import {
  clapIcon,
  commentIcon,
  filledClapIcon,
  listenIcon,
  moreIcon,
  mutePost,
  savePost,
  shareIcon,
} from "../../assets/icons";

import styles from "./postActions.module.scss";
import classNames from "classnames";
import { getPostVoteApiHandler } from "../../api/postApi";
import { usePanelContext } from "../../context/PanelProvider";
import CommentPanel from "../layout/panel/CommentPanel";

const PostActions = ({
  postId,
  isCurrentUser,
  totalVotes,
  setTotalVotes,
  isClapped,
  setIsClapped,
  atEnd,
}) => {
  const postActionClassname = classNames(styles["post-actions"], {
    [styles["post-actions-with-border"]]: !atEnd,
    [styles["post-actions-footer"]]: atEnd,
  });

  const postIconClassname = classNames(styles["post-icon"], {
    [styles["post-icon-disable"]]: isCurrentUser,
  });

  const { openPanel } = usePanelContext();

  const { data: clapData, refetch: clap } = useQuery({
    queryKey: ["getPostVote", postId],
    queryFn: ({ queryKey }) => getPostVoteApiHandler(queryKey[1]),
    enabled: false,
  });

  const { count, isClapped: userClapped } = clapData?.data.votes || [];

  console.log("totalVotes", totalVotes, count);
  console.log("userClapped", userClapped, isClapped);

  useEffect(() => {
    if (userClapped) {
      setIsClapped(userClapped);
    }

    if (count) {
      setTotalVotes(count);
    }
  }, [count, setIsClapped, setTotalVotes, userClapped]);

  const handleClap = () => {
    if (!isClapped) {
      setIsClapped(true);
    }
    clap();
  };

  const openCommentPanel = () => {
    openPanel({
      contentElement: <CommentPanel />,
      panelWidth: "414px",
    });
  };

  const savePost = () => {};

  const listenPost = () => {};

  const showMoreIcon = () => {};

  return (
    <div className={postActionClassname}>
      <div className="f ai-c">
        <div style={{ width: "74px" }}>
          <div className="f fd-r ai-c">
            <div
              className={postIconClassname}
              style={{
                width: "74px",
              }}
              onClick={handleClap}
            >
              {isClapped && filledClapIcon}
              {!isClapped && clapIcon}
              {totalVotes != 0 && (
                <p className="ml-4" style={{ fontSize: 13, color: "#6B6B6B" }}>
                  {totalVotes}
                </p>
              )}
            </div>
            <div className={postIconClassname} onClick={openCommentPanel}>
              {commentIcon}
            </div>
          </div>
        </div>
      </div>

      <div className="f fd-r ai-c g-12">
        <span className={postIconClassname} onClick={savePost}>
          {savePost}
        </span>
        {!atEnd && (
          <span className={postIconClassname} onClick={listenPost}>
            {listenIcon}
          </span>
        )}
        <span className={postIconClassname} onClick={savePost}>
          {shareIcon}
        </span>
        <span className={postIconClassname} onClick={showMoreIcon}>
          {moreIcon}
        </span>
      </div>
    </div>
  );
};

export default PostActions;
