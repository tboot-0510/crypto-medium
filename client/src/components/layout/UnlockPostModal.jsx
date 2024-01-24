import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import styles from "./authenticationModal.module.scss";
import MetamaskIcon from "../../assets/metamask_icon.svg";
import { Coins } from "@phosphor-icons/react";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useModalContext } from "../../context/ModalProvider";
import { checkBalance, getTokenPrice } from "../../utils/connectors/metamask";
import { calculateMaticArticlePrice } from "../../utils/format";
import { cryptoPaymentApiHandler } from "../../api/userApi";
import { updatePendingTransaction } from "../../store/slices/userSlice";
import { transactionStatusApi } from "../../api/transactionApi";
import { stripErrorCodes } from "../../utils/connectors/helpers";

const { ethereum } = window;

const UnlockPostModal = ({ postId, setIsProcessing }) => {
  const [step, updateStep] = useState(0);
  const { account } = useSelector((state) => ({
    account: state.user.informations.externalWalletAccount,
  }));

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { closeModal } = useModalContext();

  const startStripePayment = () => {};

  const startCryptoPayment = useCallback(
    async (postId, articlePrice, account, closeModal) => {
      try {
        const cryptoPrice = await getTokenPrice(account, closeModal);

        if (!cryptoPrice?.data.price) {
          toast.error("Failed to fetch MATIC price");
          return;
        }

        const articleCryptoPrice = Number(
          calculateMaticArticlePrice(articlePrice, cryptoPrice.data.price)
        ).toString(16);

        const accountBalance = await checkBalance(account);

        console.log("accountBalance", accountBalance, articleCryptoPrice);

        ethereum
          .request({
            method: "eth_sendTransaction",
            params: [
              {
                from: account,
                value: articleCryptoPrice,
                gas: Number(21000).toString(16),
                to: "0x54639a506d5C0BF68e765775fb895c0d4413B5De",
              },
            ],
          })
          .then(async (txHash) => {
            const resp = await cryptoPaymentApiHandler(txHash, postId);
            console.log("response", resp);
            dispatch(
              updatePendingTransaction({
                transaction_id: resp.data.id,
                post_id: postId,
              })
            );
            setIsProcessing(true);
            closeModal();
            const interval = setInterval(() => {
              transactionStatusApi(resp.data.id).then((result) => {
                if (result.data.status === "minted") {
                  clearInterval(interval);
                  setIsProcessing(false);
                  dispatch(
                    updatePendingTransaction({
                      transaction_id: "",
                      post_id: "",
                    })
                  );

                  queryClient.refetchQueries(["getPostIdApiHandler", postId]);
                }
                if (result.data.status === "mint_failed") {
                  clearInterval(interval);
                  setIsProcessing(false);
                  closeModal();
                  dispatch(
                    updatePendingTransaction({
                      transaction_id: "",
                      post_id: "",
                    })
                  );
                  toast.error("Payment failed");
                }
              });
            }, 2000);
          })
          .catch((error) => {
            setIsProcessing(false);
            toast.error(stripErrorCodes(error));
          });
      } catch (error) {
        toast.error(error.message);
      }
    },
    [dispatch, queryClient, setIsProcessing]
  );

  const stepComponents = {
    0: {
      title: "Unlock using your tokens",
      balance: {
        text: "Using your Medium balance",
        onClick: () => updateStep({ id: 1, provenance: 0 }),
      },
      crypto: {
        text: "Using your crypto balance",
        onClick: () => startCryptoPayment(postId, 0.01, account, closeModal),
      },
    },
    1: {
      title: "Unlock your Medium balance",
      balance: {
        text: "Using your Medium balance",
        onClick: () => startStripePayment({ id: 1, provenance: 0 }),
      },
    },
  };

  return (
    <div className="f fd-r w-100-p h-100-p jc-c" style={{ minHeight: "495px" }}>
      <div
        className="fd-c ai-c jc-c"
        style={{
          width: "678px",
          textAlign: "center",
          padding: "44px 56px",
        }}
      >
        <h2 className={styles.title}>{stepComponents[step]?.title}</h2>
        <div className="f fd-r jc-c ai-c g-12 mt-32">
          <CallToAction
            type="primary"
            message={stepComponents[step].balance.text}
            icon={<Coins color="black" weight="regular" size={24} />}
            onClick={stepComponents[step].balance.onClick}
            additionalStyle={{
              width: "200px",
              height: "150px",
              borderRadius: "12px",
              borderWidth: 1,
              borderColor: "black",
              backgroundColor: "white",
              color: "black",
            }}
          />
          <CallToAction
            type="primary"
            message={stepComponents[step].crypto.text}
            icon={<img src={MetamaskIcon} width="24" height="24" />}
            onClick={stepComponents[step].crypto.onClick}
            additionalStyle={{
              width: "200px",
              height: "150px",
              borderRadius: "12px",
              borderWidth: 1,
              borderColor: "black",
              backgroundColor: "white",
              color: "black",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UnlockPostModal;
