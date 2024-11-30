/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("class_types").del();

  // Inserts seed entries
  await knex("class_types").insert([
    // Coding Classes
    {
      title: "Scratch Grades 2-3: Level 1 Part 1",
      subject: "Coding",
      grades: "2-3",
    },
    {
      title: "Scratch Grades 2-3: Level 1 Part 2",
      subject: "Coding",
      grades: "2-3",
    },
    {
      title: "Scratch Grades 4-5: Level 2 Part 1",
      subject: "Coding",
      grades: "4-5",
    },
    {
      title: "Scratch Grades 4-5: Level 2 Part 2",
      subject: "Coding",
      grades: "4-5",
    },
    {
      title: "Python Grades 5-6: Level 1 Part 1",
      subject: "Coding",
      grades: "5-6",
    },
    {
      title: "Python Grades 5-6: Level 1 Part 2",
      subject: "Coding",
      grades: "5-6",
    },
    {
      title: "Web Development Grades 6-8: Level 1 Part 1",
      subject: "Coding",
      grades: "6-8",
    },
    {
      title: "Web Development Grades 6-8: Level 1 Part 2",
      subject: "Coding",
      grades: "6-8",
    },
    {
      title: "Web Development Grades 8+: Level 2 Part 1",
      subject: "Coding",
      grades: "8+",
    },
    {
      title: "Web Development Grades 8+: Level 2 Part 2",
      subject: "Coding",
      grades: "8+",
    },
    {
      title: "Python Grades 7-8: Level 2 Part 1",
      subject: "Coding",
      grades: "7-8",
    },
    {
      title: "Python Grades 7-8: Level 2 Part 2",
      subject: "Coding",
      grades: "7-8",
    },
    {
      title: "Data Structures Grade 8+: Part 1",
      subject: "Coding",
      grades: "8+",
    },
    {
      title: "Data Structures Grade 8+: Part 2",
      subject: "Coding",
      grades: "8+",
    },

    // Math Classes
    { title: "Math Grade 1: Part 1", subject: "Math", grades: "1" },
    { title: "Math Grade 1: Part 2", subject: "Math", grades: "1" },
    { title: "Math Grade 2: Part 1", subject: "Math", grades: "2" },
    { title: "Math Grade 2: Part 2", subject: "Math", grades: "2" },
    { title: "Math Grade 3: Part 1", subject: "Math", grades: "3" },
    { title: "Math Grade 3: Part 2", subject: "Math", grades: "3" },
    { title: "Math Grade 4: Part 1", subject: "Math", grades: "4" },
    { title: "Math Grade 4: Part 2", subject: "Math", grades: "4" },
    { title: "Math Grade 5: Part 1", subject: "Math", grades: "5" },
    { title: "Math Grade 5: Part 2", subject: "Math", grades: "5" },
    { title: "Math Grade 6: Part 1", subject: "Math", grades: "6" },
    { title: "Math Grade 6: Part 2", subject: "Math", grades: "6" },
    { title: "Math Grade 7: Part 1", subject: "Math", grades: "7" },
    { title: "Math Grade 7: Part 2", subject: "Math", grades: "7" },
    { title: "Math Grade 8: Part 1", subject: "Math", grades: "8" },
    { title: "Math Grade 8: Part 2", subject: "Math", grades: "8" },

    // English Classes
    {
      title: "Grammar + Vocabulary: Level 1 Part 1",
      subject: "English",
      grades: "1-2",
    },
    {
      title: "Grammar + Vocabulary: Level 1 Part 2",
      subject: "English",
      grades: "1-2",
    },
    {
      title: "Grammar + Vocabulary: Level 2 Part 1",
      subject: "English",
      grades: "3-4",
    },
    {
      title: "Grammar + Vocabulary: Level 2 Part 2",
      subject: "English",
      grades: "3-4",
    },
    {
      title: "Grammar + Vocabulary: Level 3 Part 1",
      subject: "English",
      grades: "5-6",
    },
    {
      title: "Grammar + Vocabulary: Level 3 Part 2",
      subject: "English",
      grades: "5-6",
    },
    {
      title: "Grammar + Vocabulary: Level 4 Part 1",
      subject: "English",
      grades: "7",
    },
    {
      title: "Grammar + Vocabulary: Level 4 Part 2",
      subject: "English",
      grades: "7",
    },
    {
      title: "Grammar + Vocabulary: Level 5 Part 1",
      subject: "English",
      grades: "8",
    },
    {
      title: "Grammar + Vocabulary: Level 5 Part 2",
      subject: "English",
      grades: "8",
    },
    { title: "Mechanics of Writing Part 1", subject: "English", grades: "1-2" },
    { title: "Mechanics of Writing Part 2", subject: "English", grades: "1-2" },
    { title: "Creative Writing Part 1", subject: "English", grades: "3-4" },
    { title: "Creative Writing Part 2", subject: "English", grades: "3-4" },
    { title: "Writer's Workshop Part 1", subject: "English", grades: "5-6" },
    { title: "Writer's Workshop Part 2", subject: "English", grades: "5-6" },
    { title: "Essay Writing Prep Part 1", subject: "English", grades: "7" },
    { title: "Essay Writing Prep Part 2", subject: "English", grades: "7" },
    { title: "Essay Writing Part 1", subject: "English", grades: "8" },
    { title: "Essay Writing Part 2", subject: "English", grades: "8" },

    // Science Classes
    {
      title: "Integrated Science Grade 1: Part 1",
      subject: "Science",
      grades: "1",
    },
    {
      title: "Integrated Science Grade 1: Part 2",
      subject: "Science",
      grades: "1",
    },
    {
      title: "Integrated Science Grade 2: Part 1",
      subject: "Science",
      grades: "2",
    },
    {
      title: "Integrated Science Grade 2: Part 2",
      subject: "Science",
      grades: "2",
    },
    {
      title: "Integrated Science Grade 3: Part 1",
      subject: "Science",
      grades: "3",
    },
    {
      title: "Integrated Science Grade 3: Part 2",
      subject: "Science",
      grades: "3",
    },
    {
      title: "Integrated Science Grade 4: Part 1",
      subject: "Science",
      grades: "4",
    },
    {
      title: "Integrated Science Grade 4: Part 2",
      subject: "Science",
      grades: "4",
    },
    {
      title: "Earth and Space Science Grade 5: Part 1",
      subject: "Science",
      grades: "5",
    },
    {
      title: "Earth and Space Science Grade 5: Part 2",
      subject: "Science",
      grades: "5",
    },
    { title: "Life Science Grade 6: Part 1", subject: "Science", grades: "6" },
    { title: "Life Science Grade 6: Part 2", subject: "Science", grades: "6" },
    {
      title: "Physical Science Grade 7: Part 1",
      subject: "Science",
      grades: "7",
    },
    {
      title: "Physical Science Grade 7: Part 2",
      subject: "Science",
      grades: "7",
    },
    {
      title: "Marine Science Grade 8: Part 1",
      subject: "Science",
      grades: "8",
    },
    {
      title: "Marine Science Grade 8: Part 2",
      subject: "Science",
      grades: "8",
    },
  ]);
}
