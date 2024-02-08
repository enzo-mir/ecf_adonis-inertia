import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { UpdatedFormDataType } from "utils/types/user";
import { getCurrentReservation } from "./get_reservations";

async function getUserData(ctx: HttpContextContract) {
  const userDatabase = await Database.rawQuery(
    "SELECT name, email, guests, alergy from users WHERE id = ? AND email = ?",
    [ctx.auth.user?.id, ctx.auth.user?.email]
  );
  return userDatabase[0][0] as UpdatedFormDataType;
}

async function sendUserData(ctx: HttpContextContract) {
  if (ctx.auth.user && (await getCurrentReservation(ctx))) {
    const currentReservation = await getCurrentReservation(ctx);
    const userObject = ctx.auth.user;
    const response = {
      id: userObject!.id,
      email: userObject!.email,
      guests: userObject!.guests,
      alergy: userObject!.alergy,
      name: userObject!.name,
      role: userObject!.role,
      currentReservation,
    };
    return response;
  }
}

export { getUserData, sendUserData };
