import React from "react";
import NavBar from "../components/navbar/NavBar";
import TopBanner from "../components/banner/TopBanner";
import SuggestionBar from "../components/suggestionBar/SuggestionBar";
import Post from "../components/post/Post";

const Home = () => {
  return (
    <>
      <NavBar />
      <TopBanner />
      <div className="f" style={{ margin: "auto", maxWidth: "1336px" }}>
        <div className="f fd-r jc-se">
          <main style={{ minWidth: 728, maxWidth: 728 }}>
            <SuggestionBar />
            <div style={{ paddingTop: "50px" }}>
              <article>
                <Post>Hello</Post>
              </article>
              <article>
                <Post>Hello</Post>
              </article>
            </div>
          </main>
          <div
            className="f"
            style={{
              maxWidth: 368,
              minWidth: 368,
              paddingLeft: "clamp(24px, 24px + 100vw - 1080px, 40px",
              minHeight: "100vh",
              borderLeft: "1px solid #F2F2F2",
              paddingRight: "24px",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Home;
