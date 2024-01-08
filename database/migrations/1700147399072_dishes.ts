import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "dishs";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("description").notNullable();
      table.integer("price").notNullable();
      table.boolean("sharing").notNullable();
    });

    this.defer(async (db) => {
     await db.rawQuery(
        "INSERT INTO `dishs` (`id`, `name`, `description`, `price`, `sharing`) VALUES (1, 'entrecôte (230 gr)', 'entrecôte de boeuf avec son beurre fermier', 23, 0),(2, 'camembert au four', 'camembert fondant entaillé et cuit au four', 18, 0),(3, 'raclette party', 'fromage exceptionnel pour un moment familial', 30, 1),(4, 'fondue savoyardes', 'cuve de fromage fondus à déguster entre amis', 28, 1)"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
