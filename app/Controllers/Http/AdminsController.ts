import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  getUsersInformation,
  allImages,
  getCardData,
} from "../../functions/get_props_data";
import { HourType } from "../../../utils/types/hoursType";
import Database, { RawQuery } from "@ioc:Adonis/Lucid/Database";
import { z } from "zod";
import { cardUpdateType } from "../../../utils/types/cardManagmentType";
import {
  userconfigCreateUser,
  usersConfigScheama,
} from "../../../utils/types/user";

export default class AdminsController {
  public async index(ctx: HttpContextContract) {
    if (ctx.auth.user?.role === 1) {
      return ctx.inertia.render("Admin", {
        cardData: getCardData(),
        imagesData: await allImages(),
        usersInformation: await getUsersInformation(),
      });
    } else {
      return ctx.inertia.render("UndefinedPage");
    }
  }

  public async hours(ctx: HttpContextContract) {
    try {
      const hoursData = HourType.parse(ctx.request.all());
      for (let i = 0; i < hoursData.data.length; i++) {
        const element = hoursData.data[i];
        if (element.time == "lunch") {
          const rowUpdated = await Database.rawQuery(
            `UPDATE hours SET lunch = "${element.target}" WHERE day = "${element.day}"`
          );
          if (rowUpdated[0].changedRows) {
            const allHours = await Database.rawQuery("SELECT * FROM `hours`");
            return ctx.response.json({ hours: allHours[0] });
          } else {
            return ctx.response.status(400).json({
              error:
                "Une erreur est survenus lor de la mise à jour des données",
            });
          }
        } else if (element.time == "dinner") {
          const rowUpdated = await Database.rawQuery(
            `UPDATE hours SET dinner = "${element.target}" WHERE day = "${element.day}"`
          );
          if (rowUpdated[0].changedRows) {
            const allHours = await Database.rawQuery("SELECT * FROM `hours`");
            return ctx.response.json({ hours: allHours[0] });
          } else {
            return ctx.response.status(400).json({
              error:
                "Une erreur est survenus lor de la mise à jour des données",
            });
          }
        }
      }
    } catch (error) {
      return ctx.response.status(400).json({
        error:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : "Une erreur est survenus",
      });
    }
  }

  public async cardUpdate(ctx: HttpContextContract) {
    try {
      const cardInfo = cardUpdateType.parse(ctx.request.all());

      if (
        cardInfo.formula === null &&
        cardInfo.price !== null &&
        cardInfo.desc
      ) {
        const updatedLine = await Database.rawQuery(
          `UPDATE ${cardInfo.choice_edit} SET name = "${cardInfo.title}", description = "${cardInfo.desc}", price = ${cardInfo.price} WHERE  id = ${cardInfo.id} `
        );
        if (updatedLine[0].changedRows) {
          return ctx.response.redirect().back();
        } else {
          ctx.session.flash({
            errors: "Erreur lors de la mise à jour des données",
          });
          return ctx.response.redirect().back();
        }
      } else {
        const updatedLine = await Database.rawQuery(
          `UPDATE menus SET name = "${cardInfo.title}", formula = "${cardInfo.formula}" WHERE  id = ${cardInfo.id}`
        );
        if (updatedLine[0].changedRows) {
          return ctx.response.redirect().back();
        } else {
          ctx.session.flash({
            errors: "Erreur lors de la mise à jour des données",
          });
          return ctx.response.redirect().back();
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

  public async userUpdate(ctx: HttpContextContract) {
    try {
      const usersInfo = usersConfigScheama.parse(ctx.request.all());

      if (usersInfo.password === "") {
        let updateUser: RawQuery;
        if (usersInfo.emailChange) {
          updateUser = await Database.rawQuery(
            "UPDATE `users` SET name = ?, email = ?, role = ? WHERE id = ?",
            [usersInfo.name, usersInfo.email, usersInfo.role, usersInfo.id]
          );
        } else {
          updateUser = await Database.rawQuery(
            "UPDATE `users` SET name = ?, role = ? WHERE id = ?",
            [usersInfo.name, usersInfo.role, usersInfo.id]
          );
        }

        if (updateUser[0].affectedRows > 0) {
          ctx.response.redirect().back();
        } else {
          throw new Error("Echec lors de la mise à jour des données");
        }
      } else {
        let updateUser: RawQuery;
        if (usersInfo.emailChange) {
          updateUser = await Database.rawQuery(
            "UPDATE `users` SET name = ?, role = ?, password = ? WHERE id = ?",
            [usersInfo.name, usersInfo.role, usersInfo.password, usersInfo.id]
          );
        } else {
          updateUser = await Database.rawQuery(
            "UPDATE `users` SET name = ?, email = ?, role = ?, password = ? WHERE id = ?",
            [
              usersInfo.name,
              usersInfo.email,
              usersInfo.role,
              usersInfo.password,
              usersInfo.id,
            ]
          );
        }
        if (updateUser[0].affectedRows > 0) {
          ctx.response.redirect().back();
        } else {
          throw new Error("Echec lors de la mise à jour des données");
        }
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

  public async deletUser(ctx: HttpContextContract) {
    const params: number = ctx.request.param("id");
    try {
      const lineDeleted = await Database.rawQuery(
        "DELETE FROM `users` WHERE `id` = ?",
        [params]
      );
      if (lineDeleted[0].affectedRows) {
        ctx.response.redirect().back();
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
  public async createUser(ctx: HttpContextContract) {
    try {
      const userInfos = userconfigCreateUser.parse(ctx.request.all());
      try {
        await Database.rawQuery(
          `INSERT INTO users (name, email, password, role) VALUES ("${
            userInfos.name
          }", "${userInfos.email}", "${userInfos.password}", ${1})`
        );

        ctx.response.redirect().back();
      } catch (error) {
        throw new Error(
          "Une erreur est survenus lors de la création du compte"
        );
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
