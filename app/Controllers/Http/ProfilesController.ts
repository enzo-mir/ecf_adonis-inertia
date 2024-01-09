import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { UpdatedFormDataType, updateZodType } from "../../../utils/types/user";
import { z } from "zod";
import Hash from "@ioc:Adonis/Core/Hash";

export default class ProfilesController {
  private async getUserData(ctx: HttpContextContract) {
    const user_database = await Database.rawQuery(
      "SELECT name, email, guests, alergy from users WHERE id = ? AND email = ?",
      [ctx.auth.user?.id, ctx.auth.user?.email]
    );
    return user_database[0][0] as UpdatedFormDataType;
  }

  public async update(ctx: HttpContextContract) {
    try {
      const userUpdateData = await updateZodType.parseAsync(ctx.request.all());
      if (userUpdateData.password === null) {
        const updateQuery = await Database.rawQuery(
          `UPDATE users SET name = "${userUpdateData.name}",email = "${userUpdateData.email}",guests = ${userUpdateData.guests},alergy = "${userUpdateData.alergy}" WHERE email = "${ctx.auth.user?.email}"`
        );

        if (updateQuery[0].changedRows > 0) {
          ctx.session.flash({ valid: await this.getUserData(ctx) });
          return ctx.response.redirect().back();
        } else {
          throw new Error("Echec lors de la mise à jour des données");
        }
      } else {
        let hashedPassword = await Hash.make(userUpdateData.password);

        const updateQuery = await Database.rawQuery(
          `UPDATE users SET name = "${userUpdateData.name}",email = "${userUpdateData.email}",guests = ${userUpdateData.guests},alergy = "${userUpdateData.alergy}",password="${hashedPassword}" WHERE email = "${ctx.auth.user?.email}"`
        );

        if (updateQuery[0].changedRows > 0) {
          ctx.session.flash({ valid: await this.getUserData(ctx) });
          return ctx.response.redirect().back();
        } else {
          throw new Error("Echec lors de la mise à jour des données");
        }
      }
    } catch (error) {
      ctx.session.flash({
        errors:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : error.message,
      });
      return ctx.response.redirect().back();
    }
  }

  public async logout(ctx: HttpContextContract) {
    try {
      await ctx.auth.logout();
      return ctx.inertia.redirectBack();
    } catch (error) {
      ctx.session.flash({
        errors: error.message,
      });
      return ctx.response.redirect().back();
    }
  }
}
