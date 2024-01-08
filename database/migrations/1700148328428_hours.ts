import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "hours";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("day").notNullable();
      table.string("lunch").notNullable();
      table.string("dinner").notNullable();
    });
    this.defer(async (db) => {
      await db.rawQuery(
        "INSERT INTO `hours` (`id`, `day`, `lunch`, `dinner`) VALUES (1, 'lundi', '12H - 14h', '19H - 22H'),(2, 'mardi', '12H - 14H', '19H - 22H'),(3, 'mercredi', 'fermer', 'fermer'),(4, 'jeudi', '12H - 14H', '19H - 22H'),(5, 'vendredi', '12H - 14H', '19H - 22H'),(6, 'samedi', 'fermer', '19H - 23H'),(7, 'dimanche', '12H - 14H', 'fermer')"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
