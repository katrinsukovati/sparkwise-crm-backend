import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await knex("teachers").select("*");
    res.status(200).json(
      teachers.map((teacher) => ({
        ...teacher,
        subjects: teacher.subjects.split(","),
        grades: teacher.grades.split(","),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: `Error retrieving teachers: ${error}` });
  }
};

// Get single teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const teacher = await knex("teachers").where("id", req.params.id).first();

    if (!teacher) {
      return res
        .status(404)
        .json({ message: `Teacher with ID ${req.params.id} not found.` });
    }

    res.status(200).json({
      ...teacher,
      subjects: teacher.subjects.split(","),
      grades: teacher.grades.split(","),
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving teacher: ${error}` });
  }
};

// Create a new teacher
const createNewTeacher = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    subjects,
    grades,
    additional_notes,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone_number ||
    !subjects ||
    !grades
  ) {
    return res.status(400).json({
      message:
        "First name, last name, email, phone number, subjects, and grades are required.",
    });
  }

  try {
    await knex("teachers").insert({
      first_name,
      last_name,
      email,
      phone_number,
      subjects: subjects.join(","),
      grades: grades.join(","),
      additional_notes,
    });

    res.status(201).json({ message: "Teacher created successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error creating teacher: ${error}` });
  }
};

// Update a teacher by ID
const updateTeacherById = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    subjects,
    grades,
    additional_notes,
  } = req.body;

  try {
    const updated = await knex("teachers")
      .where("id", req.params.id)
      .update({
        first_name,
        last_name,
        email,
        phone_number,
        subjects: subjects.join(","),
        grades: grades.join(","),
        additional_notes,
      });

    if (!updated) {
      return res
        .status(404)
        .json({ message: `Teacher with ID ${req.params.id} not found.` });
    }

    res.status(200).json({ message: "Teacher updated successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error updating teacher: ${error}` });
  }
};

// Delete a teacher by ID
const deleteTeacherById = async (req, res) => {
  try {
    const deleted = await knex("teachers").where("id", req.params.id).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: `Teacher with ID ${req.params.id} not found.` });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: `Error deleting teacher: ${error}` });
  }
};

export {
  getAllTeachers,
  getTeacherById,
  createNewTeacher,
  updateTeacherById,
  deleteTeacherById,
};
