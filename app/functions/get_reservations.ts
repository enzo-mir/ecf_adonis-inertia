import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export const getCurrentReservation = async (ctx: HttpContextContract) => {
  if (ctx.auth.user) {
    const reservations = await Database.rawQuery(
      "SELECT guests, date, hours, email FROM reservations WHERE user_id = ?",
      [ctx.auth.user!.id]
    );
    return reservations[0];
  } else {
    return undefined;
  }
};
