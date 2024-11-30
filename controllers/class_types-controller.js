import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all class types
const getAllClassTypes = async (req, res) => {
  try {
    const classTypes = await knex("class_types").select("*");
    res.status(200).json(classTypes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving class types", error });
  }
};

// Get a single class type by ID
const getClassTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const classType = await knex("class_types").where({ id }).first();
    if (!classType) {
      return res
        .status(404)
        .json({ message: `Class type with ID ${id} not found.` });
    }
    res.status(200).json(classType);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving class type", error });
  }
};

// Create a new class type
const createClassType = async (req, res) => {
  const { title, subject, grades } = req.body;

  if (!title || !subject || !grades) {
    return res
      .status(400)
      .json({ message: "Title, subject, and grades are required." });
  }

  try {
    const newClassTypeId = await knex("class_types").insert({
      title,
      subject,
      grades,
    });
    res
      .status(201)
      .json({
        id: newClassTypeId[0],
        message: "Class type created successfully.",
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating class type", error });
  }
};

// Update a class type by ID
const updateClassTypeById = async (req, res) => {
  const { id } = req.params;
  const { title, subject, grades } = req.body;

  if (!title || !subject || !grades) {
    return res
      .status(400)
      .json({ message: "Title, subject, and grades are required." });
  }

  try {
    const rowsUpdated = await knex("class_types")
      .where({ id })
      .update({ title, subject, grades });
    if (rowsUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Class type with ID ${id} not found.` });
    }
    res.status(200).json({ message: "Class type updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating class type", error });
  }
};

// Delete a class type by ID
const deleteClassTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await knex("class_types").where({ id }).del();
    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Class type with ID ${id} not found.` });
    }
    res.status(200).json({ message: "Class type deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting class type", error });
  }
};

export {
  getAllClassTypes,
  getClassTypeById,
  createClassType,
  updateClassTypeById,
  deleteClassTypeById,
};
