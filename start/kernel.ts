import Server from "@ioc:Adonis/Core/Server";

Server.middleware.register([
  () => import("@ioc:Adonis/Core/BodyParser"),
  () => import("@ioc:EidelLev/Inertia/Middleware"),
  () => import("App/Middleware/SilentAuth"),
]);

Server.middleware.registerNamed({
  auth: () => import("App/Middleware/Auth"),
});
