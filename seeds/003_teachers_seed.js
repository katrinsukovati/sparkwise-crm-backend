/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("teachers").del();

  // Inserts seed entries
  await knex("teachers").insert([
    {
      first_name: "Elena",
      last_name: "Gutin",
      email: "elena.gutin91@gmail.com",
      phone_number: "123-456-7890",
      subjects: "Math,Science",
      grades: "Grade 6,Grade 7,Grade 8",
      additional_notes: "Prefers weekend classes.",
    },
    {
      first_name: "Katrin",
      last_name: "Sukovati",
      email: "katrin.sukovati1@gmail.com",
      phone_number: "987-654-3210",
      subjects: "Math,Coding",
      grades: "Grade 5,Grade 6",
      additional_notes: "Prefers weekday evenings.",
    },
    {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "555-555-5555",
      subjects: "English,History",
      grades: "Grade 9,Grade 10",
      additional_notes: "Available for one-on-one tutoring.",
    },
    {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      phone_number: "444-444-4444",
      subjects: "Physics,Chemistry",
      grades: "Grade 11,Grade 12",
      additional_notes: "Prefers to work in small groups.",
    },
    {
      first_name: "Mark",
      last_name: "Taylor",
      email: "mark.taylor@example.com",
      phone_number: "333-333-3333",
      subjects: "Computer Science",
      grades: "Grade 9,Grade 10,Grade 11",
      additional_notes: "Specializes in advanced coding lessons.",
    },
  ]);
}
