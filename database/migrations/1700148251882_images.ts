import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "images";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("description").notNullable();
      table.string("url").notNullable();
      table.string("name").notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
