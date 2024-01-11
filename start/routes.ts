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

Route.group(() => {
  Route.post("/add", "ReservationsController.add");
  Route.post("/delete", "ReservationsController.delete");
}).prefix("/reservation");

Route.group(() => {
  Route.post("/update", "ProfilesController.update");
  Route.post("/logout", "ProfilesController.logout");
  Route.post("/delete", "ProfilesController.delete");
}).prefix("profile");

Route.group(() => {
  Route.post("/login", "AuthentificationsController.login");
  Route.post("/register", "AuthentificationsController.register");
}).prefix("auth");

Route.group(() => {
  Route.get("", "AdminsController.index");
  Route.post("/hoursEdition", "AdminsController.hours");
}).prefix("/admin");

Route.any("/*", async (ctx) => {
  return ctx.inertia.render("UndefinedPage");
});
