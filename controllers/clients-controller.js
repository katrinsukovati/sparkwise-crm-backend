import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all clients
// GET http://localhost:8080/clients
const getAllClients = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const { sortBy = "newest" } = req.query; // get sorting option from query params

    let sortColumn = "created_at";
    let sortDirection = "desc"; // this will be the default: newest (descending)

    if (sortBy === "oldest") {
      sortDirection = "asc"; // oldest: ascending
    }

    // build base query
    const query = knex("clients").select(
      "id",
      "parent_first_name",
      "parent_last_name",
      "parent_phone",
      "parent_email",
      "child_first_name",
      "child_grade",
      "subjects_interested",
      "city",
      "postal_code",
      "additional_notes",
      "status",
      "how_did_you_hear",
      "created_at"
    );

    // add search filter but only if provided in the request
    if (search) {
      query.where((builder) => {
        builder
          .orWhere("parent_first_name", "like", `%${search}%`)
          .orWhere("parent_last_name", "like", `%${search}%`)
          .orWhere("parent_phone", "like", `%${search}%`)
          .orWhere("parent_email", "like", `%${search}%`)
          .orWhere("child_first_name", "like", `%${search}%`)
          .orWhere("child_grade", "like", `%${search}%`)
          .orWhere("subjects_interested", "like", `%${search}%`)
          .orWhere("city", "like", `%${search}%`)
          .orWhere("postal_code", "like", `%${search}%`)
          .orWhere("additional_notes", "like", `%${search}%`)
          .orWhere("status", "like", `%${search}%`)
          .orWhere("how_did_you_hear", "like", `%${search}%`);
      });
    }

    // filter data prior to getting clients
    const clients = await query.orderBy(sortColumn, sortDirection);
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: `Error getting clients: ${error}` });
  }
};

// Get single client by id
// GET http://localhost:8080/clients/1
const getClientById = async (req, res) => {
  try {
    const singleClient = await knex("clients")
      .select(
        "id",
        "parent_first_name",
        "parent_last_name",
        "parent_phone",
        "parent_email",
        "child_first_name",
        "child_grade",
        "subjects_interested",
        "city",
        "postal_code",
        "additional_notes",
        "status",
        "how_did_you_hear",
        "created_at"
      )
      .where("id", req.params.id)
      .first();

    if (!singleClient) {
      return res.status(404).json({
        message: `Client not found with ID: ${req.params.id}`,
      });
    }
    res.status(200).json(singleClient);
  } catch (error) {
    res.status(500).json({
      message: `Error getting single client with ID ${req.params.id}: ${error}`,
    });
  }
};

// PUT for updating a single client by id
// PUT http://localhost:8080/clients/1
const updateClientById = async (req, res) => {
  const clientId = req.params.id;
  const {
    parent_first_name,
    parent_last_name,
    parent_phone,
    parent_email,
    child_first_name,
    child_grade,
    subjects_interested,
    city,
    postal_code,
    additional_notes,
    status,
    how_did_you_hear,
  } = req.body;

  // Validation
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegEx =
    /^(\+?\d{1,2})?\s?\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;

  // Mandatory fields validation
  if (typeof parent_first_name !== "string" || !parent_first_name.trim()) {
    return res.status(400).json({ message: "Parent first name is invalid." });
  }
  if (typeof parent_last_name !== "string" || !parent_last_name.trim()) {
    return res.status(400).json({ message: "Parent last name is invalid." });
  }
  if (!parent_phone.trim() || !phoneRegEx.test(parent_phone)) {
    return res.status(400).json({ message: "Phone number is invalid." });
  }
  if (!parent_email.trim() || !emailRegEx.test(parent_email)) {
    return res.status(400).json({ message: "Email is invalid." });
  }
  if (typeof child_first_name !== "string" || !child_first_name.trim()) {
    return res.status(400).json({ message: "Child first name is invalid." });
  }
  if (typeof child_grade !== "string" || !child_grade.trim()) {
    return res.status(400).json({ message: "Child's grade is invalid." });
  }
  if (typeof subjects_interested !== "string" || !subjects_interested.trim()) {
    return res.status(400).json({ message: "Subjects interested is invalid." });
  }
  if (typeof status !== "string" || !status.trim()) {
    return res.status(400).json({ message: "Status is invalid." });
  }

  // Optional fields validation
  if (typeof city !== "string") {
    return res.status(400).json({ message: "City is invalid." });
  }
  if (typeof postal_code !== "string") {
    return res.status(400).json({ message: "Postal code is invalid." });
  }
  if (typeof how_did_you_hear !== "string") {
    return res
      .status(400)
      .json({ message: "How did you hear about us is invalid." });
  }
  if (typeof additional_notes !== "string") {
    return res.status(400).json({ message: "Additional notes is invalid." });
  }

  // Try updating the client
  try {
    const rowsUpdated = await knex("clients")
      .where({ id: req.params.id })
      .update(req.body);
    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Client with ID ${req.params.id} not found.`,
      });
    }

    const updatedClient = await knex("clients").where({ id: req.params.id });
    res.json(updatedClient[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update client with ID ${req.params.id}: ${error}`,
    });
  }
};

// PUT for updating a single client by id
// PUT http://localhost:8080/clients/1
const createNewClient = async (req, res) => {
  // Extract the payload (supports both nested data which is how wix sends it and flat format)
  const payload = req.body.data || req.body;

  let {
    parent_first_name,
    parent_last_name,
    parent_phone,
    parent_email,
    child_first_name,
    child_grade,
    subjects_interested,
    city,
    postal_code,
    additional_notes = "",
    status = "Form Filled Out",
    how_did_you_hear,
  } = payload;

  // Trim all the input
  parent_first_name = parent_first_name.trim();
  parent_last_name = parent_last_name.trim();
  parent_phone = parent_phone.trim();
  parent_email = parent_email.trim();
  child_first_name = child_first_name.trim();
  child_grade = child_grade.trim();
  subjects_interested = subjects_interested.trim();
  city = city.trim();
  postal_code = postal_code.trim();
  how_did_you_hear = how_did_you_hear.trim();

  // Validation
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegEx =
    /^(\+?\d{1,2})?\s?\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;

  if (typeof parent_first_name !== "string" || !parent_first_name.trim()) {
    return res.status(400).json({ message: "Parent first name is invalid." });
  }
  if (typeof parent_last_name !== "string" || !parent_last_name.trim()) {
    return res.status(400).json({ message: "Parent last name is invalid." });
  }
  if (!parent_phone.trim() || !phoneRegEx.test(parent_phone)) {
    return res.status(400).json({ message: "Phone number is invalid." });
  }
  if (!parent_email.trim() || !emailRegEx.test(parent_email)) {
    return res.status(400).json({ message: "Email is invalid." });
  }
  if (typeof child_first_name !== "string" || !child_first_name.trim()) {
    return res.status(400).json({ message: "Child first name is invalid." });
  }
  if (typeof child_grade !== "string" || !child_grade.trim()) {
    return res.status(400).json({ message: "Child's grade is invalid." });
  }
  if (typeof subjects_interested !== "string" || !subjects_interested.trim()) {
    return res.status(400).json({ message: "Subjects interested is invalid." });
  }

  if (typeof city !== "string") {
    return res.status(400).json({ message: "City is invalid." });
  }
  if (typeof postal_code !== "string") {
    return res.status(400).json({ message: "Postal code is invalid." });
  }
  if (typeof how_did_you_hear !== "string") {
    return res
      .status(400)
      .json({ message: "How did you hear about us is invalid." });
  }
  if (typeof additional_notes !== "string") {
    return res.status(400).json({ message: "Additional notes is invalid." });
  }
  if (typeof status !== "string") {
    return res.status(400).json({ message: "Status is invalid." });
  }

  // Try creating a new client
  try {
    const result = await knex("clients").insert({
      parent_first_name,
      parent_last_name,
      parent_phone,
      parent_email,
      child_first_name,
      child_grade,
      subjects_interested,
      city,
      postal_code,
      additional_notes,
      status,
      how_did_you_hear,
    });
    res.status(201).json({ message: "Client has been created successfully." });
  } catch (error) {
    res.status(500).json({
      message: `Unable to create client: ${error}`,
    });
  }
};

const deleteClientById = async (req, res) => {
  const clientId = req.params.id;
  try {
    const client = await knex("clients")
      .select("id")
      .where("id", clientId)
      .first();

    if (!client) {
      return res
        .status(404)
        .json({ message: `Client with ID ${clientId} not found` });
    }

    await knex("clients").where("id", clientId).del();
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting client with ID: ${clientId}` });
  }
};

export {
  getAllClients,
  getClientById,
  updateClientById,
  createNewClient,
  deleteClientById,
};
