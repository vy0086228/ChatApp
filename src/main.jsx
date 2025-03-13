// src/main.jsx or src/index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store from "./redux/store";
import { persistStore } from "redux-persist";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import App from "./App";
import "./index.css";

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Provide Redux store to the entire application */}
    <Provider store={store}>
      {/* PersistGate ensures state hydration from local storage */}
      <PersistGate loading={null} persistor={persistor}>
        {/* Auth Context Provider */}
        <AuthProvider>
          {/* WebSocket Context Provider */}
          <SocketProvider>
            <App />
          </SocketProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
