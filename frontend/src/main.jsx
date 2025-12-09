import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import "./index.css";
import { ToastProvider } from "./context/ToastContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <ToastProvider>
          <BrowserRouter>
            <App />
        </BrowserRouter>
    </ToastProvider>
  </Provider>
);
