import Inertia from "@ioc:EidelLev/Inertia";
import { allHours } from "App/Controllers/getPropsData";
import getUserData from "App/Controllers/getUserData";

Inertia.share({
  errors: (ctx) => {
    return ctx.session.flashMessages.get("errors");
  },
  valid: (ctx) => {
    return ctx.session.flashMessages.get("valid");
  },
  hours: async () => {
    return (await allHours)[0];
  },
}).version(() => Inertia.manifestFile("public/assets/manifest.json"));
