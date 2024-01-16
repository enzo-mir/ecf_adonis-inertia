import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { allHours, allImages, getCardData } from "../getPropsData";

export default class PropsPagesController {
  private async getUserData(ctx: HttpContextContract) {
    return await Database.rawQuery(
      `SELECT * FROM users WHERE email = "${ctx.auth.user?.email}"`
    );
  }

  public async home(ctx: HttpContextContract) {
    if (ctx.auth.user) {
      const currentReservation = await Database.rawQuery(
        "SELECT guests, date, hours, email FROM reservations WHERE email = ?",
        [ctx.auth.user.email]
      );

      const userData = ctx.auth.user
        ? (await this.getUserData(ctx))[0][0].role === 0
          ? {
              user: {
                ...(await this.getUserData(ctx))[0][0],
                currentReservation: currentReservation[0],
              },
            }
          : { admin: {} }
        : {};
      delete userData.user?.id;
      delete userData.user?.password;
      delete userData.user?.role;

      return ctx.inertia.render("Home", {
        userData: userData,
        images: (await allImages)[0],
        hours: (await allHours)[0],
      });
    } else {
      return ctx.inertia.render("Home", {
        userData: undefined,
        images: (await allImages)[0],
        hours: (await allHours)[0],
      });
    }
  }

  public async card(ctx: HttpContextContract) {
    if (ctx.auth.user) {
      const currentReservation = await Database.rawQuery(
        "SELECT guests, date, hours, email FROM reservations WHERE email = ?",
        [ctx.auth.user.email]
      );

      const userData = ctx.auth.user
        ? (await this.getUserData(ctx))[0][0].role === 0
          ? {
              user: {
                ...(await this.getUserData(ctx))[0][0],
                currentReservation: currentReservation[0],
              },
            }
          : { admin: {} }
        : {};
      delete userData.user?.id;
      delete userData.user?.password;
      delete userData.user?.role;

      return ctx.inertia.render("Card", {
        userData,
        cardData: getCardData(),
        hours: (await allHours)[0],
      });
    } else {
      return ctx.inertia.render("Card", {
        userData: undefined,
        cardData: getCardData(),
        hours: (await allHours)[0],
      });
    }
  }
}
