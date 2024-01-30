import React from "react";
import { createRoot } from "react-dom/client";
import { InertiaApp } from "@inertiajs/inertia-react";
import "../css/App.css";
import { InertiaProgress } from "@inertiajs/progress";

const app = document.getElementById("app");
const root = createRoot(app);
InertiaProgress.init({ color: "#4a3f30" });
root.render(
  <InertiaApp
    initialPage={JSON.parse(app.dataset.page)}
    resolveComponent={async (name) =>
      await import(`./Pages/${name}.tsx`).then((module) => module.default)
    }
    initialComponent={""}
  />
);
