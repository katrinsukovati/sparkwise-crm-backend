import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await knex("classes")
      .join("semesters", "classes.semester_id", "semesters.id")
      .join("class_types", "classes.class_type_id", "class_types.id")
      .select(
        "classes.*",
        "semesters.name as semester_name",
        "class_types.title as class_title",
        "class_types.subject as class_subject",
        "class_types.grades as class_grades"
      );

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Failed to fetch classes." });
  }
};
// get a class by id
const getClassById = async (req, res) => {
  const { id } = req.params;

  try {
    const classData = await knex("classes")
      .where("classes.id", id)
      .join("semesters", "classes.semester_id", "semesters.id")
      .join("class_types", "classes.class_type_id", "class_types.id")
      .select(
        "classes.*", 
        "semesters.name as semester_name",
        "class_types.title as class_title",
        "class_types.subject as class_subject",
        "class_types.grades as class_grades"
      )
      .first();

    if (!classData) {
      return res
        .status(404)
        .json({ message: `Class with ID ${id} not found.` });
    }

    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class by ID:", error);
    res.status(500).json({ message: "Failed to fetch class by ID." });
  }
};

// create a new class
const createClass = async (req, res) => {
  const {
    class_type_id,
    teacher_id,
    days,
    start_time,
    end_time,
    start_date,
    end_date,
    occurrences,
  } = req.body;

  if (
    !class_type_id ||
    !teacher_id ||
    !days ||
    !start_time ||
    !end_time ||
    !start_date ||
    !end_date ||
    !occurrences
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [id] = await knex("classes").insert({
      class_type_id,
      teacher_id,
      days,
      start_time,
      end_time,
      start_date,
      end_date,
      occurrences,
    });
    const newClass = await knex("classes").where({ id }).first();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: "Error creating class", error });
  }
};

// update an existing class by id
const updateClass = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const rowsUpdated = await knex("classes").where({ id }).update(updates);
    if (!rowsUpdated) {
      return res.status(404).json({ message: "Class not found" });
    }
    const updatedClass = await knex("classes").where({ id }).first();
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: "Error updating class", error });
  }
};

// delete a class by id
const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await knex("classes").where({ id }).del();
    if (!rowsDeleted) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting class", error });
  }
};

export { getAllClasses, getClassById, createClass, updateClass, deleteClass };
