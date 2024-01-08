import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "starters";

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
        "INSERT INTO `starters` (`id`, `name`, `description`, `price`, `sharing`) VALUES (1, 'la salade Savoyarde', 'salade traditionnelle au chèvre chaud', 12, 0),(2, 'assortiment de charcuterie', 'assortiment de jambon de la région', 13, 0),(3, 'crousti-camembert', 'camembert coulant enrobé avec une chapelure', 16, 1),(4, 'friands savoyards', 'pate feuilletée au coeur fondant', 15, 1);"
      );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
