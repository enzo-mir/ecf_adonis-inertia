import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { allImages, getCardData } from "../../functions/get_props_data";

export default class PropsPagesController {
  public async home(ctx: HttpContextContract) {
    return ctx.inertia.render("Home", {
      images: await allImages(),
    });
  }

  public async card(ctx: HttpContextContract) {
    return ctx.inertia.render("Card", {
      cardData: getCardData(),
    });
  }
}
