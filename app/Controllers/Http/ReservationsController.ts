import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ReservationFromBodySheama } from "../../../utils/types/reservationSceama";

export default class ReservationsController {
  private guestsLimit = 35;

  public async add(ctx: HttpContextContract) {
    try {
      const requestData = await ReservationFromBodySheama.parseAsync(
        ctx.request.all()
      );
      console.log(requestData);
    } catch (error) {
      ctx.session.flash({ errors: JSON.parse(error.message)[0].message });
      return ctx.response.redirect().back();
    }
  }
}
