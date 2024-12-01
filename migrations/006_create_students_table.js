/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("students", (table) => {
    table.increments("id").primary();
    table
      .integer("parent_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").notNullable().unique();
    table.date("date_of_birth").notNullable();
    table.string("grade").notNullable();
    table.string("additional_notes").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("students");
}
