import React, { useState } from "react";
import { validateEmail } from "../../utils/validations";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { CaretLeft } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./forms.module.scss";
import { loginApiHandler, signUpApiHandler } from "../../api/loginApi";
import { loginUser } from "../../store/slices/userSlice";
import { useModalContext } from "../../context/ModalProvider";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
  username: "",
};

const SignUpForm = ({ step, updateStep }) => {
  const [signUpData, setSignUpData] = useState(INITIAL_STATE);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { closeModal } = useModalContext();

  const relatedStep = {
    0: {
      text: "Enter your email address to create an account.",
      onProceed: (props) => signUpApiHandler(props),
      inputFields: [
        { type: "text", name: "name", text: "Name" },
        { type: "text", name: "username", text: "Username" },
        { type: "text", name: "email", text: "Email" },
        { type: "password", name: "password", text: "Password" },
      ],
      backText: "All sign up options",
    },
    2: {
      text: "Enter the email address associated with your account.",
      onProceed: (props) => loginApiHandler(props),
      inputFields: [
        { type: "text", name: "email", text: "Email" },
        { type: "password", name: "password", text: "Password" },
      ],
      backText: "All sign in options",
    },
  };

  const handleInputChange = (event) => {
    const formInputData = { [event.target.name]: event.target.value };
    setSignUpData({ ...signUpData, ...formInputData });
  };

  const proceedStep = () => {
    if (!validateEmail(signUpData.email)) {
      setEmailError("Invalid email");
      return;
    }

    onProceed(signUpData)
      .then((response) => {
        localStorage.setItem("autenticated", true);
        dispatch(loginUser(response.data));

        closeModal();
      })
      .catch((err) => {
        setError(err?.response?.data?.message);
        setSignUpData(INITIAL_STATE);
      });
  };

  const { text, inputFields, onProceed, backText } =
    relatedStep[step.provenance];

  return (
    <>
      <div style={{ maxWidth: "316px" }}>{text}</div>
      {error && <div className={styles.error}>{error}</div>}
      <form className="f fw-w" onSubmit={proceedStep}>
        <div className="fd-c fb-100 centered g-8 mt-16">
          {inputFields.map((input, index) => (
            <div key={index} className={styles["input-box"]}>
              <label className={styles["label-name"]}>{input.text}</label>
              <input
                type={input.type}
                name={input.name}
                style={{
                  minWidth: 240,
                  maxWidth: 447,
                }}
                onChange={(event) => handleInputChange(event)}
                required
              />
            </div>
          ))}

          {emailError && <div className={styles.error}>{emailError}</div>}
          <CallToAction
            type="primary"
            message="Continue"
            onClick={proceedStep}
            additionalStyle={{
              width: "226px",
              marginTop: "32px",
              padding: "8 16",
              backgroundColor: "black",
            }}
          />
          <button
            className="fd-r ai-c"
            style={{ marginTop: 24 }}
            onClick={() => updateStep({ id: 0, provenance: 2 })}
          >
            <CaretLeft size={12} />
            <p className="ml-12" style={{ color: "#1A8917" }}>
              {backText}
            </p>
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUpForm;
