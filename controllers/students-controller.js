import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const { sortBy = "newest" } = req.query; // sorting option

    // default sorting column and direction
    let sortColumn = "students.created_at";
    let sortDirection = "desc"; // newest by default

    if (sortBy === "oldest") {
      sortDirection = "asc"; // oldest
    } else if (sortBy === "name") {
      sortColumn = "students.first_name";
      sortDirection = "asc"; // sort by first name alphabetically
    }

    // Base query with joins
    const query = knex("students")
      .join("clients", "students.parent_id", "clients.id") // join with clients for parent details
      .leftJoin(
        "class_enrollments",
        "students.id",
        "class_enrollments.student_id"
      ) // join with class_enrollments
      .leftJoin("classes", "class_enrollments.class_id", "classes.id") // join with classes for course details
      .select(
        "students.id as student_id",
        "students.first_name as student_first_name",
        "students.last_name as student_last_name",
        "students.email as student_email",
        "students.date_of_birth",
        "students.grade",
        "students.additional_notes",
        "clients.id as parent_id",
        "clients.parent_first_name",
        "clients.parent_last_name",
        "clients.parent_email",
        "clients.parent_phone",
        "classes.id as class_id",
        "classes.days",
        "classes.start_date",
        "classes.end_date",
        "classes.start_time",
        "classes.end_time",
        "students.created_at" // needed for sorting by newest/oldest
      );

    // add search filter
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

    // apply sorting
    const students = await query.orderBy(sortColumn, sortDirection);

    // group students by ID
    const groupedStudents = students.reduce((acc, student) => {
      const {
        student_id,
        student_first_name,
        student_last_name,
        student_email,
        date_of_birth,
        grade,
        additional_notes,
        parent_id,
        parent_first_name,
        parent_last_name,
        parent_email,
        parent_phone,
        class_id,
        days,
        start_date,
        end_date,
        start_time,
        end_time,
      } = student;

      if (!acc[student_id]) {
        acc[student_id] = {
          student_id,
          first_name: student_first_name,
          last_name: student_last_name,
          email: student_email,
          date_of_birth,
          grade,
          additional_notes,
          parent: {
            parent_id,
            first_name: parent_first_name,
            last_name: parent_last_name,
            email: parent_email,
            phone: parent_phone,
          },
          enrollments: [],
        };
      }

      if (class_id) {
        acc[student_id].enrollments.push({
          class_id,
          days,
          start_date,
          end_date,
          start_time,
          end_time,
        });
      }

      return acc;
    }, {});

    res.status(200).json(Object.values(groupedStudents));
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students." });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const studentData = await knex("students")
      .where("students.id", id)
      .join("clients", "students.parent_id", "clients.id")
      .leftJoin(
        "class_enrollments",
        "students.id",
        "class_enrollments.student_id"
      )
      .leftJoin("classes", "class_enrollments.class_id", "classes.id")
      .select(
        "students.id as student_id",
        "students.first_name as student_first_name",
        "students.last_name as student_last_name",
        "students.email as student_email",
        "students.date_of_birth",
        "students.grade",
        "students.additional_notes",
        "clients.id as parent_id",
        "clients.parent_first_name",
        "clients.parent_last_name",
        "clients.parent_email",
        "clients.parent_phone",
        "classes.id as class_id",
        "classes.days",
        "classes.start_date",
        "classes.end_date",
        "classes.start_time",
        "classes.end_time"
      );

    if (!studentData.length) {
      return res
        .status(404)
        .json({ message: `Student with ID ${id} not found.` });
    }

    const student = {
      student_id: studentData[0].student_id,
      first_name: studentData[0].student_first_name,
      last_name: studentData[0].student_last_name,
      email: studentData[0].student_email,
      date_of_birth: studentData[0].date_of_birth,
      grade: studentData[0].grade,
      additional_notes: studentData[0].additional_notes,
      parent: {
        parent_id: studentData[0].parent_id,
        first_name: studentData[0].parent_first_name,
        last_name: studentData[0].parent_last_name,
        email: studentData[0].parent_email,
        phone: studentData[0].parent_phone,
      },
      enrollments: studentData
        .filter((data) => data.class_id) // but onnly include classes if the student is enrolled in any otherwise done
        .map((data) => ({
          class_id: data.class_id,
          days: data.days,
          start_date: data.start_date,
          end_date: data.end_date,
          start_time: data.start_time,
          end_time: data.end_time,
        })),
    };

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Failed to fetch student." });
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
    res.status(500).json({
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
