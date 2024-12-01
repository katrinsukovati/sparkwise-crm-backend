import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// get all students
const getAllStudents = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const { sortBy = "newest" } = req.query;

    let sortColumn = "students.created_at";
    let sortDirection = "desc";

    if (sortBy === "oldest") {
      sortDirection = "asc";
    } else if (sortBy === "name") {
      sortColumn = "students.first_name";
      sortDirection = "asc";
    }

    const query = knex("students")
      .join("clients", "students.parent_id", "clients.id")
      .select(
        "students.id as student_id",
        "students.first_name",
        "students.last_name",
        "students.email",
        "students.date_of_birth",
        "students.grade",
        "students.additional_notes",
        "clients.id as parent_id",
        "clients.parent_first_name",
        "clients.parent_last_name",
        "clients.parent_email",
        "clients.parent_phone",
        "students.created_at"
      );

    if (search) {
      query.where((builder) => {
        builder
          .orWhere("students.first_name", "like", `%${search}%`)
          .orWhere("students.last_name", "like", `%${search}%`)
          .orWhere("students.email", "like", `%${search}%`)
          .orWhere("clients.parent_first_name", "like", `%${search}%`)
          .orWhere("clients.parent_last_name", "like", `%${search}%`)
          .orWhere("clients.parent_email", "like", `%${search}%`)
          .orWhere("clients.parent_phone", "like", `%${search}%`);
      });
    }

    const students = await query.orderBy(sortColumn, sortDirection);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students." });
  }
};

// get single student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await knex("students")
      .where("students.id", id)
      .join("clients", "students.parent_id", "clients.id")
      .select(
        "students.id as student_id",
        "students.first_name",
        "students.last_name",
        "students.email",
        "students.date_of_birth",
        "students.grade",
        "students.additional_notes",
        "clients.id as parent_id",
        "clients.parent_first_name",
        "clients.parent_last_name",
        "clients.parent_email",
        "clients.parent_phone"
      )
      .first();

    if (!student) {
      return res
        .status(404)
        .json({ message: `Student with ID ${id} not found.` });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Failed to fetch student." });
  }
};

// create a new student
const createStudent = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    date_of_birth,
    grade,
    additional_notes,
    parent_id,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !date_of_birth ||
    !grade ||
    !parent_id
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  try {
    const [studentId] = await knex("students").insert({
      first_name,
      last_name,
      email,
      date_of_birth,
      grade,
      additional_notes,
      parent_id,
    });

    res
      .status(201)
      .json({ id: studentId, message: "Student created successfully." });
  } catch (error) {
    console.error("Error creating student:", error);
    res
      .status(500)
      .json({ message: `Error creating student: ${error.message}` });
  }
};

// update a student by id
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
    console.error(`Error updating student with ID ${req.params.id}:`, error);
    res
      .status(500)
      .json({ message: `Error updating student: ${error.message}` });
  }
};

// delete a student by ID
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
    res.status(500).json({
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
