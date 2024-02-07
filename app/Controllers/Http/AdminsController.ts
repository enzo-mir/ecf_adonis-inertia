import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { allHours, allImages, getCardData } from "../getPropsData";
import { HourType } from "../../../utils/types/hoursType";
import Database from "@ioc:Adonis/Lucid/Database";
import { z } from "zod";
import { cardUpdateType } from "../../../utils/types/cardManagmentType";

export default class AdminsController {
  public async index(ctx: HttpContextContract) {
    if (ctx.auth.user?.role === 1) {
      return ctx.inertia.render("Admin", {
        cardData: getCardData(),
        imagesData: (await allImages)[0],
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
}
