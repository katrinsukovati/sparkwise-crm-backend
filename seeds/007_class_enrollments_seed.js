/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("class_enrollments").del();

  // Inserts seed entries
  await knex("class_enrollments").insert([
    {
      class_id: 1,
      student_id: 1,
    },
    {
      class_id: 2,
      student_id: 2,
    },
    {
      class_id: 3,
      student_id: 3,
    },
    {
      class_id: 4,
      student_id: 1,
    },
    {
      class_id: 5,
      student_id: 4,
    },
    {
      class_id: 6,
      student_id: 2,
    },
    {
      class_id: 7,
      student_id: 5,
    },
  ]);
}
