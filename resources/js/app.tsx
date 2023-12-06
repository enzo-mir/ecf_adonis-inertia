import { InertiaApp } from "@inertiajs/inertia-react";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "../css/app.css";

// initial page object with props from server
const container = document.getElementById("app");
const page = JSON.parse(container?.dataset.page as string);
const root = createRoot(container);

// dynamically load specified page component from "resources/js/Pages/." dir
async function resolver(pageName: string) {
  const module = await import(`./Pages/${pageName}`);
  return module.default;
}

function App() {
  return (
    <InertiaApp
      initialPage={page}
      resolveComponent={resolver}
      initialComponent={""}
    />
  );
}

root.render(<App />);
