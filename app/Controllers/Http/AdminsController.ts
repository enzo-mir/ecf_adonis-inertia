import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { allHours, allImages, getCardData } from "../getPropsData";

export default class AdminsController {
  public async index(ctx: HttpContextContract) {
    if (ctx.auth.user?.role === 1) {
      return ctx.inertia.render("Admin", {
        hoursData: (await allHours)[0],
        cardData: getCardData(),
        imagesData: (await allImages)[0],
      });
    } else {
      return ctx.inertia.render("UndefinedPage");
    }
  }
}
