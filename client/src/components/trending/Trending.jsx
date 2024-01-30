import React from "react";
import styles from "./trending.module.scss";
import { trendingIcon } from "../../assets/icons";
import { useQuery } from "@tanstack/react-query";
import { getTrendingPostsApiHandler } from "../../api/postApi";

const Trending = () => {
  const { data } = useQuery({
    queryKey: ["getTrendingPosts"],
    queryFn: () => getTrendingPostsApiHandler(),
  });

  console.log("trending", data);

  return (
    <div className="f jc-c">
      <div className={styles["trending-section"]}>
        <div className="pt-48 pb-16">
          <div className="f fd-r mb-16">
            {trendingIcon}
            <h2 className="fs-16" style={{ fontWeight: 500 }}>
              Trending on Medium
            </h2>
          </div>
        </div>
        <div className="w-100-p">
          <div className={styles["trending-grid"]}></div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
