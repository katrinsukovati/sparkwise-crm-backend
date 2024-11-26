/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("clients", (table) => {
    table.increments("id").primary();
    table.string("parent_first_name").notNullable();
    table.string("parent_last_name").notNullable();
    table.string("parent_phone").notNullable();
    table.string("parent_email").notNullable();
    table.string("child_first_name").notNullable();
    table.string("child_grade").notNullable();
    table.string("subjects_interested").notNullable();
    table.string("city").nullable();
    table.string("postal_code").nullable();
    table.string("additional_notes").nullable();
    table.string("status").notNullable().defaultTo("Form Submitted");
    table.string("how_did_you_hear").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("clients");
}
