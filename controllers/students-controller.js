import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await knex("students").select("*");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving students: ${error}` });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await knex("students").where("id", req.params.id).first();
    if (!student) {
      return res
        .status(404)
        .json({ message: `Student not found with ID: ${req.params.id}` });
    }
    res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error retrieving student with ID ${req.params.id}: ${error}`,
      });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    date_of_birth,
    grade,
    additional_notes,
  } = req.body;

  // This validates all the required fields to make sure nothing is empty
  if (!first_name || !last_name || !email || !date_of_birth || !grade) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  try {
    const [id] = await knex("students").insert({
      first_name,
      last_name,
      email,
      date_of_birth,
      grade,
      additional_notes,
    });

    res.status(201).json({ id, message: "Student created successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error creating student: ${error}` });
  }
};

// Update a student by ID
const updateStudentById = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    date_of_birth,
    grade,
    additional_notes,
  } = req.body;

  try {
    const updated = await knex("students").where("id", req.params.id).update({
      first_name,
      last_name,
      email,
      date_of_birth,
      grade,
      additional_notes,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: `Student with ID ${req.params.id} not found.` });
    }

    res.status(200).json({ message: "Student updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error updating student with ID ${req.params.id}: ${error}`,
      });
  }
};

// Delete a student by ID
const deleteStudentById = async (req, res) => {
  try {
    const deleted = await knex("students").where("id", req.params.id).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: `Student with ID ${req.params.id} not found.` });
    }

    res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error deleting student with ID ${req.params.id}: ${error}`,
      });
  }
};

export {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
};
