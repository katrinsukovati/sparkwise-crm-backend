/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("semesters").del();

  // Inserts seed entries
  await knex("semesters").insert([
    {
      name: "Spring 2024",
      start_date: "2024-01-08",
      end_date: "2024-04-19",
    },
    {
      name: "Summer 2024",
      start_date: "2024-05-06",
      end_date: "2024-08-15",
    },
    {
      name: "Fall 2024",
      start_date: "2024-09-02",
      end_date: "2024-12-20",
    },
    {
      name: "Winter 2025",
      start_date: "2025-01-06",
      end_date: "2025-04-19",
    },
    {
      name: "Summer 2025",
      start_date: "2024-05-05",
      end_date: "2024-08-16",
    },
    {
      name: "Fall 2025",
      start_date: "2024-09-08",
      end_date: "2024-12-20",
    },
  ]);
}
