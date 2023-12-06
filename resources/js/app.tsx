import { InertiaApp } from "@inertiajs/inertia-react";
import React from "react";
import ReactDOM from "react-dom";
import "../css/app.css";

// initial page object with props from server
const root = document.getElementById("app");
const page = JSON.parse(root?.dataset.page as string);

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

ReactDOM.render(<App />, root);
