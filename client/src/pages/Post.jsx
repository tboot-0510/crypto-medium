import { useState } from "react";
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
import UnlockPostModal from "../components/layout/modal/UnlockPostModal";
import Loading from "../reusable-elements/loading/Loading";
import Badge from "../reusable-elements/badge/Badge";
import PostActions from "../components/postActions/postActions";

const Post = () => {
  const { id } = useParams();

  const { currentUserId, currentUsername } = useSelector((state) => ({
    currentUsername: state.user.informations.name,
    currentUserId: state.user.informations.id,
  }));

  const [isProcessing, setIsProcessing] = useState(false);

  const { openModal } = useModalContext();

  const { data } = useQuery({
    queryKey: ["getPostIdApiHandler", id],
    queryFn: ({ queryKey }) => getPostIdApiHandler(queryKey[1]),
  });

  const {
    title,
    markdown,
    createdAt,
    userId,
    membersOnly,
    isLocked,
    tags,
    votes,
    isClapped,
  } = data?.data.post || [];

  if (title) {
    document.title = title + " - Medium";
  }

  const unlockPost = () => {
    openModal({
      contentElement: (
        <UnlockPostModal postId={id} setIsProcessing={setIsProcessing} />
      ),
    });
  };

  const [totalVotes, setTotalVotes] = useState(votes?.length);
  const [clapped, setClapped] = useState(isClapped);

  const isCurrentUser = currentUserId === userId?._id;

  return (
    <>
      <NavBar />

      <div className="f fd-c jc-c ai-c h-100-p" style={{ minHeight: "100vh" }}>
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
          <PostAuthor author={userId} createdAt={createdAt} />
          <PostActions
            postId={id}
            isCurrentUser={isCurrentUser}
            totalVotes={totalVotes}
            setTotalVotes={setTotalVotes}
            isClapped={clapped}
            setIsClapped={setClapped}
          />
          <div className="mt-24">{markdown}</div>
          {isLocked && (
            <div className="f jc-c ai-c">
              <div className={styles["post-fade-away"]} />
              <div className={styles["post-upgrade"]}>
                <h2 className={styles["post-upgrade-title"]}>
                  {toUppercase(currentUsername)}, read the best stories from
                  industry leaders on Medium.
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
                  {!isProcessing && (
                    <>
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
                    </>
                  )}
                  {isProcessing && <Loading />}
                </div>
              </div>
            </div>
          )}
          <div className={styles["post-tags"]}>
            {tags?.map((tag, index) => (
              <Badge
                key={index}
                item={tag}
                additionalStyle={{ padding: "8px 16px" }}
              />
            ))}
          </div>
          <PostActions
            postId={id}
            author={userId}
            isCurrentUser={isCurrentUser}
            totalVotes={totalVotes}
            setTotalVotes={setTotalVotes}
            isClapped={clapped}
            setIsClapped={setClapped}
            atEnd
          />
        </div>
        <div className={styles["post-author-articles"]}>
          <div className="f jc-c">
            <div className="fd fa">
              <div className="f ai-fe jc-sb mb-12">
                <div
                  className={styles.icon}
                  style={
                    // item.icon
                    //   ? {
                    //       backgroundImage: `url(${item.icon})`,
                    //       backgroundColor: "transparent",
                    //     }
                    {
                      backgroundColor: "green",
                    }
                  }
                />
              </div>
              <div className="f ai-fs jc-sb">
                <div>
                  <div className="f ai-c"></div>
                  <div className="f mt-8"></div>
                  <div className="mt-16"></div>
                </div>
                <div>Following</div>
                <div className="gj rt" />
              </div>
            </div>
          </div>
          <div className="f jc-c">
            <div className="fd fa">
              <div className="mt-40 mb-12">
                <h2>More from Thomas Boot</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
