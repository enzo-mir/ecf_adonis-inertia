import Route from "@ioc:Adonis/Core/Route";

Route.get("/", "PropsPagesController.home").as("home");

Route.get("/carte", "PropsPagesController.card");
/* Route.post("/test", (ctx) => {
  try {
    throw new Error("La condition n'est pas satisfaite");
  } catch (error) {
    ctx.session.flash({ errors: error.message });
    return ctx.response.redirect().toRoute("home");
  }
}); */

Route.post("/reservation", "ReservationsController.add");
