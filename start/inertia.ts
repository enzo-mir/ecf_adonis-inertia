import Inertia from "@ioc:EidelLev/Inertia";
import { allHours } from "App/Controllers/getPropsData";

Inertia.share({
  errors: (ctx) => {
    return ctx.session.flashMessages.get("errors");
  },
  hours: async () => (await allHours)[0],
  user: (ctx) => ctx.auth.user,
}).version(() => Inertia.manifestFile("public/assets/manifest.json"));
