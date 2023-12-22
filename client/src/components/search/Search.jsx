import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchIcon } from "../../assets/icons.jsx";
import styles from "./search.module.scss";

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleKeyDown(e) {
    if (e.key == "Enter" && query) {
      const q = query;
      setQuery("");
      navigate(`search/stories/${q}`);
    }
  }
  return (
    <div className={styles.searchbar}>
      <div className="f ai-c" style={{ margin: "0 12px" }}>
        {searchIcon}
      </div>
      <input
        onKeyDown={(e) => handleKeyDown(e)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "75%",
          height: "70%",
          border: "none",
          outline: "transparent",
          backgroundColor: "transparent",
          padding: "10px 20px 10px 0",
          textAlign: "left",
          alignItems: "center",
          display: "flex",
        }}
        type="text"
        placeholder="Search"
      />
    </div>
  );
};
export default Search;
