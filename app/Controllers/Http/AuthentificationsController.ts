import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { LoginUserScheama } from "../../../utils/types/user";
import { z } from "zod";
import { getUserData } from "../getUserData";
import Database from "@ioc:Adonis/Lucid/Database";
import Hash from "@ioc:Adonis/Core/Hash";

export default class AuthentificationsController {
  public async login(ctx: HttpContextContract) {
    try {
      let userinfo = LoginUserScheama.parse(ctx.request.all());
      const getDatabsePwd = await Database.rawQuery(
        "SELECT `password` FROM `users` WHERE email = ?",
        [userinfo.email]
      );
      if (!(await Hash.verify(getDatabsePwd[0][0].password, userinfo.password))) {
        throw new Error(
          "Ces informations d'identification ne correspondent pas."
        );
      } else {
        await ctx.auth.attempt(userinfo.email, userinfo.password);
      }

      ctx.session.flash({ valid: await getUserData(ctx) });
      return ctx.response.redirect().back();
    } catch (error) {
      console.log(error);

      ctx.session.flash({
        errors:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : "Ces informations d'identification ne correspondent pas.",
      });
      return ctx.response.redirect().back();
    }
  }
}
