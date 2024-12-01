import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await knex("classes").select("*");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving classes", error });
  }
};

// Get a class by id
const getClassById = async (req, res) => {
  const { id } = req.params;
  try {
    const classData = await knex("classes").where({ id }).first();
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classData);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving class", error });
  }
};

// Create a new class
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

// Update an existing class by id
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

// Delete a class by id
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
