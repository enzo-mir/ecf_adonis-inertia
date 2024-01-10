import Database from "@ioc:Adonis/Lucid/Database";

async function getCardData() {
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

const allImages = Database.rawQuery(
  "SELECT `id`, `title`, `description`, `url` FROM `images`"
);
const allHours = Database.rawQuery("SELECT * FROM `hours` WHERE 1");

export { getCardData, allImages, allHours };
