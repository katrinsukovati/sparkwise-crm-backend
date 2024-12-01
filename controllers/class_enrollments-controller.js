import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await knex("class_enrollments").select(
      "student_id",
      "class_id"
    );

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving enrollments: ${error}` });
  }
};

// get single enrollment by id
const getEnrollmentById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "class enrollment id is required" });
  }

  try {
    const enrollments = await knex("class_enrollments")
      .select("student_id", "class_id")
      .where("id", req.params.id);

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving enrollments: ${error}` });
  }
};

// get enrollments by student ID
const getEnrollmentsByStudentId = async (req, res) => {
  const { student_id } = req.params;

  if (!student_id) {
    return res.status(400).json({ message: "Student ID is required." });
  }

  try {
    const enrollments = await knex("class_enrollments")
      .where("student_id", student_id)
      .join("classes", "class_enrollments.class_id", "classes.id")
      .join("semesters", "classes.semester_id", "semesters.id")
      .join("class_types", "classes.class_type_id", "class_types.id")
      .select(
        "class_enrollments.id as enrollment_id",
        "classes.id as class_id",
        "classes.days",
        "classes.start_date",
        "classes.end_date",
        "semesters.name as semester_name",
        "class_types.title as class_title",
        "class_types.subject as class_subject"
      );

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Failed to fetch enrollments." });
  }
};

// enroll a student in a specific clas
const enrollStudent = async (req, res) => {
  const { class_id, student_id } = req.body;

  if (!class_id || !student_id) {
    return res
      .status(400)
      .json({ message: "Class ID and Student ID are required." });
  }

  try {
    // must validate class_id to make sure it exists
    const classExists = await knex("classes").where("id", class_id).first();
    if (!classExists) {
      return res.status(404).json({ message: "Class not found." });
    }

    // validate student_id to make sure it even exists
    const studentExists = await knex("students")
      .where("id", student_id)
      .first();
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found." });
    }

    const [id] = await knex("class_enrollments").insert({
      class_id,
      student_id,
    });

    res.status(201).json({ id, message: "Student enrolled successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error enrolling student: ${error}` });
  }
};

// delete an enrollment using id of class enrollemt (not student id)
const deleteEnrollmentById = async (req, res) => {
  try {
    const deleted = await knex("class_enrollments")
      .where("id", req.params.id)
      .del();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: `Enrollment with ID ${req.params.id} not found.` });
    }

    res.status(200).json({ message: "Enrollment deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: `Error deleting enrollment with ID ${req.params.id}: ${error}`,
    });
  }
};

export {
  getAllEnrollments,
  getEnrollmentById,
  enrollStudent,
  deleteEnrollmentById,
  getEnrollmentsByStudentId,
};
