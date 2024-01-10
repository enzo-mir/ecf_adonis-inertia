import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { UpdatedFormDataType } from "utils/types/user";
async function getUserData(ctx: HttpContextContract) {
  const user_database = await Database.rawQuery(
    "SELECT name, email, guests, alergy from users WHERE id = ? AND email = ?",
    [ctx.auth.user?.id, ctx.auth.user?.email]
  );
  return user_database[0][0] as UpdatedFormDataType;
}
async function getReservation(ctx: HttpContextContract) {
  const reservations = await Database.rawQuery(
    "SELECT `guests`,`date`,`hours`,`email` FROM `reservations` WHERE email = ?",
    [ctx.auth.user?.email]
  );
  if (reservations[0].length) {
    let tableReservation: Array<object> = [];

    reservations[0].map((reservations) => tableReservation.push(reservations));
    return reservations[0][0] as UpdatedFormDataType;
  } else {
    return [];
  }
}

export { getUserData, getReservation };
