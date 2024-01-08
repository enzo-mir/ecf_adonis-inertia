import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "menus";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("formula").notNullable();
    });

    this.defer(async (db) => {
      await db.rawQuery(
        "INSERT INTO `menus` (`id`, `name`, `formula`) VALUES (1, 'menu du marché', 'entrée + plat 30€,plat + dessert 26€'),(2, 'menu du montagnard (soirs)', 'entrée + tartiflette(1 pers) 30€,entrée + plat + dessert 34€');"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
