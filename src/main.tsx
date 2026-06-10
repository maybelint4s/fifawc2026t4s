import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig
      value={{
        fetcher: (resource: string, init?: RequestInit) =>
          fetch(resource, init).then((res) => res.json()),
        revalidateOnFocus: true,
        dedupingInterval: 5000,
        errorRetryCount: 3,
      }}
    >
      <App />
    </SWRConfig>
  </StrictMode>
);
