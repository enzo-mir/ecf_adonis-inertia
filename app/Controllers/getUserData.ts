import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { UpdatedFormDataType } from "utils/types/user";

export async function getUserData(ctx: HttpContextContract) {
  const user_database = await Database.rawQuery(
    "SELECT name, email, guests, alergy from users WHERE id = ? AND email = ?",
    [ctx.auth.user?.id, ctx.auth.user?.email]
  );
  return user_database[0][0] as UpdatedFormDataType;
}
