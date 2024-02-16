import { InertiaApp } from "@inertiajs/inertia-react";
import { createRoot } from "react-dom/client";
import "../css/App.css";
const container = document.getElementById("app");
const page = JSON.parse(container?.dataset.page as string);
const root = createRoot(container!);

async function resolver(pageName: string) {
  const module = await import(`./Pages/${pageName}.tsx`);
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
