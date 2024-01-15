import { createInertiaApp } from "@inertiajs/inertia-react";
import { createRoot } from "react-dom/client";
import "../css/App.css";

createInertiaApp({
  resolve: (name) => import(`./Pages/${name}.tsx`),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
