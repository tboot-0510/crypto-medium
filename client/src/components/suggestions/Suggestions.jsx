import React, { createElement } from "react";
import styles from "./suggestions.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getRecommendations, getSuggestions } from "../../api/mediumApi";
import { useSelector } from "react-redux";
import Card from "../../reusable-elements/card/Card";
import Badge from "../../reusable-elements/badge/Badge";

const Suggestions = ({ type, text, onClick, children }) => {
  const { user } = useSelector((state) => ({
    user: state.user.informations,
  }));

  const functionTable = {
    recommendations: {
      fn: {
        queryFn: () => getRecommendations({ userId: user?.id }),
        queryKey: ["recommendations"],
      },
      child: ({ data }) => (
        <div className="f fw-w g-8 ai-fs">
          {data?.data?.map((item, index) => (
            <Badge key={index} item={item} />
          ))}
        </div>
      ),
    },
    suggestions: {
      fn: {
        queryFn: () => getSuggestions({ userId: user?.id }),
        queryKey: ["suggestions"],
      },
      child: ({ data }) => {
        data?.data?.map((item, index) => <Card key={index} item={item} />);
      },
    },
  };

  const { data } = useQuery(functionTable[type].fn);

  return (
    <div className={styles.suggestions}>
      <h2 className={styles["suggestions-title"]}>{text}</h2>
      {functionTable[type].child({ data })}
    </div>
  );
};

export default Suggestions;
