import { useState } from "react";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { loginApiHandler } from "../../api/loginApi";
import GoogleIcon from "../../assets/google_icon.svg";

import styles from "./authenticationModal.module.scss";
import { Envelope } from "@phosphor-icons/react/dist/ssr";
import SignUpForm from "../forms/SignUpForm";

const AuthenticationModal = () => {
  const [step, updateStep] = useState({ id: 0, provenance: null });

  const stepComponents = {
    0: {
      title: "Join Medium.",
      terms_keyword: "Sign up",
      google: {
        text: "Sign up with Google",
        onClick: loginApiHandler,
      },
      email: {
        text: "Sign up with email",
        onClick: () => updateStep({ id: 1, provenance: 0 }),
        onProceed: () => console.log("sign up"),
      },
      switch: {
        text: "Already have an account?",
        onClick: () => updateStep({ id: 2, provenance: 0 }),
        additionalText: "Sign in",
      },
    },
    1: {
      title: "Sign up with email",
      terms_keyword: "Sign up",
      subtitle: "Enter your email address to create an account.",
      element: <SignUpForm step={step} updateStep={updateStep} />,
    },
    2: {
      title: "Welcome back.",
      terms_keyword: "Sign in",
      google: {
        text: "Sign in with Google",
        onClick: loginApiHandler,
      },
      email: {
        text: "Sign in with email",
        onClick: () => updateStep({ id: 1, provenance: 2 }),
        onProceed: () => console.log("sign in"),
      },
      switch: {
        text: "No account?",
        onClick: () => updateStep({ id: 0, provenance: 2 }),
        additionalText: "Create one",
      },
    },
  };

  const stepId = step.id;

  return (
    <div className="f fd-r w-100-p h-100-p jc-c" style={{ minHeight: "695px" }}>
      <div
        className="fd-c ai-c jc-c"
        style={{
          width: "678px",
          textAlign: "center",
          padding: "44px 56px",
        }}
      >
        <h2 className={styles.title}>{stepComponents[stepId]?.title}</h2>
        {(stepId === 0 || stepId === 2) && (
          <div className="f fd-c ai-c mt-48 g-12">
            <CallToAction
              type="primary"
              message={stepComponents[stepId].google.text}
              icon={<img src={GoogleIcon} />}
              onClick={stepComponents[stepId].google.onClick}
              addSpace
              additionalStyle={{
                width: "300px",
                borderWidth: 1,
                borderColor: "black",
                backgroundColor: "white",
                color: "black",
              }}
            />
            <CallToAction
              type="primary"
              message={stepComponents[stepId].email.text}
              icon={<Envelope color="black" weight="regular" size={24} />}
              onClick={stepComponents[stepId].email.onClick}
              addSpace
              additionalStyle={{
                width: "300px",
                borderWidth: 1,
                borderColor: "black",
                backgroundColor: "white",
                color: "black",
              }}
            />
            <div className="mt-48 mb-100 fs-16">
              <span>{stepComponents[stepId].switch.text}</span>
              <a
                className={styles.switch_button}
                onClick={stepComponents[stepId].switch.onClick}
              >
                {stepComponents[stepId].switch.additionalText}
              </a>
            </div>

            <div className={styles.terms} style={{ width: "450px" }}>
              {`Click “${stepComponents[stepId].terms_keyword}” to agree to Medium’s Terms of Service and acknowledge
    that Medium’s Privacy Policy applies to you.`}
            </div>
          </div>
        )}
        {stepId === 1 && (
          <div className="f fd-c ai-c mt-48 g-12">
            {stepComponents[stepId]?.element}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationModal;
