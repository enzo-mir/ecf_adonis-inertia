import React from "react";
import { createRoot } from "react-dom/client";
import { render } from "react-dom";
import { InertiaApp } from "@inertiajs/inertia-react";
import "../css/App.css";

const app = document.getElementById("app");
const root = createRoot(app);
root.render(
  <InertiaApp
    initialPage={JSON.parse(app.dataset.page)}
    resolveComponent={(name) =>
      import(`./Pages/${name}`).then((module) => module.default)
    }
    initialComponent={""}
  />
);
