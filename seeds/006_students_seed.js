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
      parent_id: 1,
      first_name: "Emily",
      last_name: "Johnson",
      email: "emily.johnson@example.com",
      date_of_birth: "2010-05-15",
      grade: "Grade 8",
      additional_notes: "Needs help with math and science.",
    },
    {
      parent_id: 1,
      first_name: "Michael",
      last_name: "Johnson",
      email: "michael.johnson@example.com",
      date_of_birth: "2011-08-22",
      grade: "Grade 7",
      additional_notes: "Interested in coding and robotics.",
    },
    {
      parent_id: 2,
      first_name: "Sophia",
      last_name: "Davis",
      email: "sophia.davis@example.com",
      date_of_birth: "2012-03-18",
      grade: "Grade 6",
      additional_notes: "Excels in English and creative writing.",
    },
    {
      parent_id: 3,
      first_name: "James",
      last_name: "Miller",
      email: "james.miller@example.com",
      date_of_birth: "2010-11-03",
      grade: "Grade 8",
      additional_notes: "Struggles with physics concepts.",
    },
    {
      parent_id: 4,
      first_name: "Olivia",
      last_name: "Wilson",
      email: "olivia.wilson@example.com",
      date_of_birth: "2011-09-12",
      grade: "Grade 7",
      additional_notes: "Prefers hands-on science experiments.",
    },
    {
      parent_id: 5,
      first_name: "Liam",
      last_name: "Martinez",
      email: "liam.martinez@example.com",
      date_of_birth: "2012-01-20",
      grade: "Grade 6",
      additional_notes: "Highly skilled in mathematics.",
    },
    {
      parent_id: 6,
      first_name: "Ava",
      last_name: "Garcia",
      email: "ava.garcia@example.com",
      date_of_birth: "2013-06-30",
      grade: "Grade 5",
      additional_notes: "Interested in arts and crafts.",
    },
    {
      parent_id: 7,
      first_name: "Noah",
      last_name: "Rodriguez",
      email: "noah.rodriguez@example.com",
      date_of_birth: "2011-04-25",
      grade: "Grade 7",
      additional_notes: "Enjoys coding and solving puzzles.",
    },
    {
      parent_id: 8,
      first_name: "Isabella",
      last_name: "Hernandez",
      email: "isabella.hernandez@example.com",
      date_of_birth: "2012-12-14",
      grade: "Grade 6",
      additional_notes: "Excels in biology and chemistry.",
    },
    {
      parent_id: 9,
      first_name: "Ethan",
      last_name: "Lopez",
      email: "ethan.lopez@example.com",
      date_of_birth: "2010-07-09",
      grade: "Grade 8",
      additional_notes: "Needs assistance with time management.",
    },
  ]);
}
