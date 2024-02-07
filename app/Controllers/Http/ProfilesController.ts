import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { updateZodType } from "../../../utils/types/user";
import { z } from "zod";
import Hash from "@ioc:Adonis/Core/Hash";
import { getUserData } from "../../functions/get_user_data";

export default class ProfilesController {
  public async update(ctx: HttpContextContract) {
    try {
      const userUpdateData = await updateZodType.parseAsync(ctx.request.all());
      if (userUpdateData.password === null) {
        const updateQuery = await Database.rawQuery(
          `UPDATE users SET name = "${userUpdateData.name}",email = "${userUpdateData.email}",guests = ${userUpdateData.guests},alergy = "${userUpdateData.alergy}" WHERE email = "${ctx.auth.user?.email}"`
        );

        if (updateQuery[0].changedRows > 0) {
          ctx.session.flash({ valid: await getUserData(ctx) });
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
          ctx.session.flash({ valid: await getUserData(ctx) });
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
      return ctx.response.status(400).redirect().back();
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      const lineDeleted = await Database.rawQuery(
        "DELETE FROM `users` WHERE `id` = ? AND `email` = ? AND `name` = ? ",
        [ctx.auth.user?.id, ctx.auth.user?.email, ctx.auth.user?.name]
      );
      if (lineDeleted[0].affectedRows) {
        await this.logout(ctx);
      } else {
        throw new Error(
          "Une erreur est survenus lors de la suppression du compte"
        );
      }
    } catch (error) {
      ctx.session.flash({
        errors: error.message,
      });
      return ctx.response.redirect().back();
    }
  }
}
