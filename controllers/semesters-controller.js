import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all semesters with total classes and total students
const getAllSemesters = async (req, res) => {
  try {
    const semesters = await knex("semesters")
      .select(
        "semesters.*",
        knex.raw("COUNT(DISTINCT classes.id) as total_classes"),
        knex.raw(
          "COUNT(DISTINCT class_enrollments.student_id) as total_students"
        )
      )
      .leftJoin("classes", "semesters.id", "classes.semester_id")
      .leftJoin("class_enrollments", "classes.id", "class_enrollments.class_id")
      .groupBy("semesters.id");

    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving semesters: ${error}` });
  }
};

// Get a single semester by ID
const getSemesterById = async (req, res) => {
  try {
    const semester = await knex("semesters").where("id", req.params.id).first();

    if (!semester) {
      return res
        .status(404)
        .json({ message: `Semester not found with ID: ${req.params.id}` });
    }

    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving semester: ${error}` });
  }
};

// Create a new semester
const createSemester = async (req, res) => {
  const { name, start_date, end_date } = req.body;

  // Validate required fields
  if (!name || !start_date || !end_date) {
    return res.status(400).json({ message: "All fields must be provided." });
  }

  try {
    const [id] = await knex("semesters").insert({ name, start_date, end_date });
    res.status(201).json({ id, message: "Semester created successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error creating semester: ${error}` });
  }
};

// Update a semester by ID
const updateSemesterById = async (req, res) => {
  const { name, start_date, end_date } = req.body;

  try {
    const updated = await knex("semesters")
      .where("id", req.params.id)
      .update({ name, start_date, end_date });

    if (!updated) {
      return res
        .status(404)
        .json({ message: `Semester with ID ${req.params.id} not found.` });
    }

    res.status(200).json({ message: "Semester updated successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error updating semester: ${error}` });
  }
};

// Delete a semester by ID
const deleteSemesterById = async (req, res) => {
  try {
    const deleted = await knex("semesters").where("id", req.params.id).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: `Semester with ID ${req.params.id} not found.` });
    }

    res.status(200).json({ message: "Semester deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error deleting semester: ${error}` });
  }
};

export {
  getAllSemesters,
  getSemesterById,
  createSemester,
  updateSemesterById,
  deleteSemesterById,
};
