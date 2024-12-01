import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await knex("class_enrollments")
      .join("classes", "class_enrollments.class_id", "classes.id")
      .join("students", "class_enrollments.student_id", "students.id")
      .select(
        "class_enrollments.id",
        "classes.id as class_id",
        "classes.days",
        "classes.start_date",
        "classes.end_date",
        "students.id as student_id",
        "students.first_name",
        "students.last_name"
      );

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving enrollments: ${error}` });
  }
};

// Get single enrollment by id
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await knex("class_enrollments")
      .where("class_enrollments.id", req.params.id)
      .join("classes", "class_enrollments.class_id", "classes.id")
      .join("students", "class_enrollments.student_id", "students.id")
      .select(
        "class_enrollments.id",
        "classes.id as class_id",
        "classes.days",
        "classes.start_date",
        "classes.end_date",
        "students.id as student_id",
        "students.first_name",
        "students.last_name"
      )
      .first();

    if (!enrollment) {
      return res
        .status(404)
        .json({ message: `Enrollment not found with ID: ${req.params.id}` });
    }
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving enrollment with ID ${req.params.id}: ${error}`,
    });
  }
};

// Enroll a student in a class
const enrollStudent = async (req, res) => {
  const { class_id, student_id } = req.body;

  if (!class_id || !student_id) {
    return res
      .status(400)
      .json({ message: "Class ID and Student ID are required." });
  }

  try {
    const [id] = await knex("class_enrollments").insert({
      class_id,
      student_id,
    });

    res.status(201).json({ id, message: "Student enrolled successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error enrolling student: ${error}` });
  }
};

// Delete an enrollment by id
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
};
