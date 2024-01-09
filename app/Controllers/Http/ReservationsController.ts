import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  DeleteReservationScheama,
  ReservationFromBodySheama,
} from "../../../utils/types/reservationSceama";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ReservationsController {
  private guestsLimit = 35;

  public async add(ctx: HttpContextContract) {
    try {
      const requestData = ReservationFromBodySheama.parse(ctx.request.all());

      let reservationSameDay = await Database.rawQuery(
        "SELECT guests FROM reservations WHERE date= ? AND moment = ? AND email = ?",
        [requestData.date, requestData.timeTargeted, requestData.email]
      );
      if (reservationSameDay[0].length) {
        throw new Error(
          "vous ne pouvez pas réserver le même jour aux mêmes plages horaires"
        );
      }

      let checkGuestsLimit: Array<Array<{ guests: number }>> =
        await Database.rawQuery(
          `SELECT guests FROM reservations WHERE date="${requestData.date}" AND moment="${requestData.timeTargeted}"`
        );

      /* CHECK GUEST LIMIT */
      if (
        checkGuestsLimit[0].length &&
        checkGuestsLimit[0].reduce((acc, current) => acc + current.guests, 0) +
          requestData.guests >
          this.guestsLimit
      ) {
        throw new Error(
          "nombre de Convive maximum atteint, veuillez choisir une autre plage d'horaire"
        );
      }
      const userId = await Database.rawQuery(
        "SELECT id FROM users WHERE email = ?",
        [requestData.email]
      );

      let reservationInsertion = await Database.rawQuery(
        `INSERT INTO reservations (id, user_id, guests, date, moment, hours, name, email, alergy) VALUES (null,${
          userId[0].length ? userId[0][0].id : null
        },${requestData.guests},"${requestData.date}","${
          requestData.timeTargeted
        }","${requestData.hourTargeted}","${requestData.name}","${
          requestData.email
        }","${requestData.alergy}")`
      );

      if (reservationInsertion.length && ctx.auth.user) {
        let responseOfData: Array<Array<object>> = await Database.rawQuery(
          "SELECT `guests`,`date`,`hours`,`email` FROM `reservations` WHERE email = ?",
          [ctx.auth.user.email]
        );

        if (responseOfData[0].length) {
          let tableReservation: Array<object> = [];

          responseOfData[0].map((reservations) =>
            tableReservation.push(reservations)
          );
          ctx.session.flash({ valid: tableReservation });
          return ctx.response.redirect().back();
        } else {
          throw new Error("Echec de l'accé aux données");
        }
      } else if (reservationInsertion.length) {
        return ctx.response.redirect().back();
      } else {
        throw new Error("Echec de la réservation");
      }
    } catch (error) {
      ctx.session.flash({
        errors:
          typeof error.message === "string"
            ? error.message
            : JSON.parse(error.message)[0]?.message,
      });
      return ctx.response.redirect().back();
    }
  }

  public async delete(ctx: HttpContextContract) {
    try {
      let requestData = DeleteReservationScheama.parse(ctx.request.all());
      let deleteWithData = await Database.rawQuery(
        "DELETE FROM `reservations` WHERE `guests` = ? AND `date` = ? AND `hours` = ? AND `email` = ?",
        [
          requestData.guests,
          requestData.date,
          requestData.hours,
          requestData.email,
        ]
      );
      if (deleteWithData.length) {
        let responseOfData: Array<Array<object>> = await Database.rawQuery(
          "SELECT `guests`,`date`,`hours`,`email` FROM `reservations` WHERE email = ?",
          [ctx.auth.user?.email]
        );
        if (responseOfData[0]) {
          let tableReserv: Array<object> = [];
          responseOfData[0].map((elem) => tableReserv.push(elem));
          ctx.session.flash({ valid: tableReserv });
          return ctx.response.redirect().back();
        } else {
          throw new Error("echec de la supression");
        }
      }
    } catch (error) {
      ctx.session.flash({
        errors: !JSON.parse(error.message)
          ? error.message
          : JSON.parse(error.message)[0]?.message,
      });
      return ctx.response.redirect().back();
    }
  }
}
