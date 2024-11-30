/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("class_types", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable(); 
    table.string("subject").notNullable();
    table.string("grades").notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("class_types");
}
