import React from "react";
import NavBar from "../components/navbar/NavBar";
import TopBanner from "../components/banner/TopBanner";
import SuggestionBar from "../components/suggestionBar/SuggestionBar";
import Post from "../components/post/Post";
import { useQuery } from "@tanstack/react-query";
import { getTopicData } from "../api/mediumApi";
import Suggestions from "../components/suggestions/Suggestions";

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getTopicData"],
    queryFn: () => getTopicData(),
  });

  const { feed, items, status } = data?.data || [];

  console.log("data", feed, items, status, isLoading);

  return (
    <>
      <NavBar />
      <TopBanner />
      <div className="" style={{ margin: "auto", maxWidth: "1336px" }}>
        <div className="f fd-r jc-se">
          <main style={{ minWidth: 728, maxWidth: 728 }}>
            <SuggestionBar />
            <div style={{ paddingTop: "50px" }}>
              {items?.map((item, index) => (
                <article key={index}>
                  <Post item={item} index={index} />
                </article>
              ))}
            </div>
          </main>
          <div
            className="f fd-c"
            style={{
              maxWidth: 368,
              minWidth: 368,
              paddingLeft: "clamp(24px, 24px + 100vw - 1080px, 40px",
              minHeight: "100vh",
              borderLeft: "1px solid #F2F2F2",
              paddingRight: "24px",
              boxSizing: "border-box",
            }}
          >
            <Suggestions type="suggestions" text="Staff Picks" />
            <Suggestions type="recommendations" text="Recommended Topics" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
