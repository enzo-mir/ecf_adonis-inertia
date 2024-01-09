import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class PropsPagesController {
  private async getUserData(ctx: HttpContextContract) {
    return await Database.rawQuery(
      `SELECT * FROM users WHERE email = "${ctx.auth.user?.email}"`
    );
  }
  private async getCardData() {
    const starters = await Database.rawQuery("SELECT * FROM `starters`");
    const dishs = await Database.rawQuery("SELECT * FROM `dishs`");
    const desserts = await Database.rawQuery("SELECT * FROM `desserts`");
    const menus = await Database.rawQuery("SELECT * FROM `menus`");
    return {
      starters: starters[0],
      dishs: dishs[0],
      desserts: desserts[0],
      menus: menus[0],
    };
  }

  private images = Database.rawQuery(
    "SELECT `id`, `title`, `description`, `url` FROM `images`"
  );
  private hours = Database.rawQuery("SELECT * FROM `hours` WHERE 1");

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
        images: (await this.images)[0],
        hours: (await this.hours)[0],
      });
    } else {
      return ctx.inertia.render("Home", {
        userData: undefined,
        images: (await this.images)[0],
        hours: (await this.hours)[0],
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
        cardData: this.getCardData(),
        hours: (await this.hours)[0],
      });
    } else {
      return ctx.inertia.render("Card", {
        userData: undefined,
        cardData: this.getCardData(),
        hours: (await this.hours)[0],
      });
    }
  }
}
