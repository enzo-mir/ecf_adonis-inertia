import "../css/App.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { InertiaApp } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";

const app = document.getElementById("app");
const root = createRoot(app);
InertiaProgress.init({ color: "#4a3f30" });
root.render(
  <InertiaApp
    initialPage={JSON.parse(app.dataset.page)}
    resolveComponent={(name) =>
      import(`./Pages/${name}.tsx`).then((module) => module.default)
    }
    initialComponent={""}
  />
);
