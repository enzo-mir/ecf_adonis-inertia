import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { CreateUserScheama, LoginUserScheama } from "../../../utils/types/user";
import { z } from "zod";
import { getReservation, getUserData } from "../getUserData";
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
      await Hash.verify(getDatabsePwd[0][0].password, userinfo.password);
      await ctx.auth.attempt(userinfo.email, userinfo.password);
      if (ctx.auth.user?.role === 1) {
        ctx.session.flash({ valid: { admin: {} } });
        return ctx.response.redirect().back();
      } else {
        ctx.session.flash({
          valid: {
            user: {
              ...(await getUserData(ctx)),
              currentReservation: await getReservation(ctx),
            },
          },
        });
        return ctx.response.redirect().back();
      }
    } catch (error) {
      ctx.session.flash({
        errors:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : "Ces informations d'identification ne correspondent pas.",
      });
      return ctx.response.redirect().back();
    }
  }

  public async register(ctx: HttpContextContract) {
    try {
      const registerData = CreateUserScheama.parse({
        ...ctx.request.all(),
        alergy: ctx.request.only(["alergy"]).alergy || "",
      });

      const hashedPassword = await Hash.make(registerData.password);

      const insertionQuery = await Database.rawQuery(
        `INSERT INTO users(name, email, password, guests, alergy) VALUES ("${registerData.name}","${registerData.email}","${hashedPassword}",${registerData.guests},"${registerData.alergy}")`
      );
      if (insertionQuery[0].affectedRows > 0) {
        await ctx.auth.attempt(registerData.email, registerData.password);
        ctx.session.flash({
          valid: {
            user: {
              ...(await getUserData(ctx)),
              currentReservation: await getReservation(ctx),
            },
          },
        });
        return ctx.response.redirect().back();
      } else {
        throw new Error("Problème lors de la création du compte");
      }
    } catch (error) {
      ctx.session.flash({
        errors:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : error.code === "ER_DUP_ENTRY"
            ? "L'email est déja utilisé"
            : error.message,
      });
      return ctx.response.redirect().back();
    }
  }
}
