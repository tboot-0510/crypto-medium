import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../scss/styles.scss";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModalProvider from "./context/ModalProvider.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import OverlayProvider from "./context/OverlayProvider.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <OverlayProvider>
              <App />
            </OverlayProvider>
          </ModalProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
