import Inertia from "@ioc:EidelLev/Inertia";
import { allHours } from "App/functions/get_props_data";
import { sendUserData } from "App/functions/get_user_data";

Inertia.share({
  errors: (ctx) => {
    return ctx.session.flashMessages.get("errors");
  },
  hours: async () => (await allHours())[0],
  user: async (ctx) => await sendUserData(ctx),
}).version(() => Inertia.manifestFile("public/assets/manifest.json"));