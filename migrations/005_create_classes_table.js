/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("classes", (table) => {
    table.increments("id").primary();
    table
      .integer("semester_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("semesters")
      .onDelete("CASCADE");
    table
      .integer("class_type_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("class_types")
      .onDelete("CASCADE");
    table
      .integer("teacher_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("teachers")
      .onDelete("CASCADE");
    table.string("days").notNullable();
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.date("start_date").notNullable();
    table.date("end_date").notNullable();
    table.integer("occurrences").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .table("classes", (table) => {
      // Drop the foreign key constraint and then the column
      table.dropForeign("semester_id");
      table.dropColumn("semester_id");
    })
    .then(() => {
      // Then drop the table
      return knex.schema.dropTable("classes");
    });
}
