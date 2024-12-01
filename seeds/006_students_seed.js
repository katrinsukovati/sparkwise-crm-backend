/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("students").del();

  // Inserts seed entries
  await knex("students").insert([
    {
      first_name: "Emily",
      last_name: "Johnson",
      email: "emily.johnson@example.com",
      date_of_birth: "2010-05-15",
      grade: "Grade 8",
      additional_notes: "Needs help with math and science.",
    },
    {
      first_name: "Michael",
      last_name: "Brown",
      email: "michael.brown@example.com",
      date_of_birth: "2011-08-22",
      grade: "Grade 7",
      additional_notes: "Interested in coding and robotics.",
    },
    {
      first_name: "Sophia",
      last_name: "Davis",
      email: "sophia.davis@example.com",
      date_of_birth: "2012-03-18",
      grade: "Grade 6",
      additional_notes: "Excels in English and creative writing.",
    },
    {
      first_name: "James",
      last_name: "Miller",
      email: "james.miller@example.com",
      date_of_birth: "2010-11-03",
      grade: "Grade 8",
      additional_notes: "Struggles with physics concepts.",
    },
    {
      first_name: "Olivia",
      last_name: "Wilson",
      email: "olivia.wilson@example.com",
      date_of_birth: "2011-09-12",
      grade: "Grade 7",
      additional_notes: "Prefers hands-on science experiments.",
    },
    {
      first_name: "Liam",
      last_name: "Martinez",
      email: "liam.martinez@example.com",
      date_of_birth: "2012-01-20",
      grade: "Grade 6",
      additional_notes: "Highly skilled in mathematics.",
    },
    {
      first_name: "Ava",
      last_name: "Garcia",
      email: "ava.garcia@example.com",
      date_of_birth: "2013-06-30",
      grade: "Grade 5",
      additional_notes: "Interested in arts and crafts.",
    },
    {
      first_name: "Noah",
      last_name: "Rodriguez",
      email: "noah.rodriguez@example.com",
      date_of_birth: "2011-04-25",
      grade: "Grade 7",
      additional_notes: "Enjoys coding and solving puzzles.",
    },
    {
      first_name: "Isabella",
      last_name: "Hernandez",
      email: "isabella.hernandez@example.com",
      date_of_birth: "2012-12-14",
      grade: "Grade 6",
      additional_notes: "Excels in biology and chemistry.",
    },
    {
      first_name: "Ethan",
      last_name: "Lopez",
      email: "ethan.lopez@example.com",
      date_of_birth: "2010-07-09",
      grade: "Grade 8",
      additional_notes: "Needs assistance with time management.",
    },
  ]);
}
