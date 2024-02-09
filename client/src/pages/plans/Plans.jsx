import { useState } from "react";
import mediumLogo from "../../assets/medium.svg";
import { useQuery } from "@tanstack/react-query";
import { getTagsApiHandler, submitTagsApiHandler } from "../../api/tagApi";
import Badge from "../../reusable-elements/badge/Badge";
import { plusIcon } from "../../assets/icons";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./plans.module.scss";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { toast } from "react-toastify";

const Plans = () => {
  const [topics, setTopics] = useState([]);

  const { currentUserId } = useSelector((state) => ({
    currentUserId: state.user.informations.id,
  }));

  const { state } = useLocation();
  const { navigate } = useNavigate();

  const { data } = useQuery({
    queryKey: ["getTags"],
    queryFn: () => getTagsApiHandler(),
  });

  const { tags } = data?.data || [];

  const disabled = topics.length < 3;

  const submitTopics = () => {
    submitTagsApiHandler(currentUserId, topics).then((resp) => {
      console.log("resp?.data", resp);
      if (resp?.status === 200) {
        navigate("/get-started/plans", { state: { userId: currentUserId } });
        return;
      }
      toast.error("An Error Occured");
    });
  };

  const addTopic = (value) => {
    setTopics((prev) => {
      if (prev.includes(value)) {
        return prev.filter((prevValue) => prevValue != value);
      }
      return [...prev, value];
    });
  };

  return (
    <>
      <div className="fd-c jc-c ai-c" style={{ minHeight: "100vh" }}>
        <div className={styles["topics"]}>
          <div className="f fd-c ai-c jc-c">
            <div className="mt-24">
              <img src={mediumLogo} className="logo react" alt="Medium logo" />
            </div>
            <div className="mt-64">
              <h2>Support great writing and access all stories on Medium.</h2>
            </div>
            <div className="mt-16">
              <p>Choose three or more.</p>
            </div>
            <div className="mt-48">
              <div className="f fd-r fw-w jc-c">
                {tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    item={tag.name}
                    icon={plusIcon}
                    checked={topics.includes(tag.name)}
                    additionalStyle={{
                      marginBottom: "8px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => addTopic(tag.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["topics-footer"]}>
        <div style={{ padding: "16px 0" }}>
          <div className="f jc-c ai-c">
            <div className={styles["topics-footer-content"]}>
              <CallToAction
                type="primary"
                disabled={disabled}
                message="Continue"
                onClick={submitTopics}
                centerText
                additionalStyle={{
                  width: "280px",
                  fontSize: "20px",
                  backgroundColor: disabled ? "black" : "#1a8917",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Plans;
