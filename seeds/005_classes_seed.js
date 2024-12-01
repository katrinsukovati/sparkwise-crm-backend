/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("classes").del();

  // Inserts seed entries
  await knex("classes").insert([
    {
      class_type_id: 1,
      teacher_id: 1,
      days: "Monday,Wednesday",
      start_time: "15:00",
      end_time: "16:00",
      start_date: "2024-01-08",
      end_date: "2024-04-17",
      occurrences: 30,
      semester_id: 1,
    },
    {
      class_type_id: 2,
      teacher_id: 2,
      days: "Tuesday,Thursday",
      start_time: "16:00",
      end_time: "17:00",
      start_date: "2024-01-09",
      end_date: "2024-04-18",
      occurrences: 30,
      semester_id: 2,
    },
    {
      class_type_id: 3,
      teacher_id: 2,
      days: "Monday",
      start_time: "17:00",
      end_time: "18:00",
      start_date: "2024-01-08",
      end_date: "2024-04-15",
      occurrences: 15,
      semester_id: 3,
    },
    {
      class_type_id: 4,
      teacher_id: 1,
      days: "Wednesday",
      start_time: "18:00",
      end_time: "19:30",
      start_date: "2024-01-10",
      end_date: "2024-04-17",
      occurrences: 15,
      semester_id: 4,
    },
    {
      class_type_id: 5,
      teacher_id: 1,
      days: "Thursday",
      start_time: "16:30",
      end_time: "17:30",
      start_date: "2024-01-11",
      end_date: "2024-04-18",
      occurrences: 15,
      semester_id: 5,
    },
    {
      class_type_id: 6,
      teacher_id: 2,
      days: "Friday",
      start_time: "14:30",
      end_time: "15:30",
      start_date: "2024-01-12",
      end_date: "2024-04-19",
      occurrences: 15,
      semester_id: 1,
    },
    {
      class_type_id: 7,
      teacher_id: 1,
      days: "Friday",
      start_time: "15:30",
      end_time: "17:00",
      start_date: "2024-01-12",
      end_date: "2024-04-19",
      occurrences: 15,
      semester_id: 2,
    },
  ]);
}
