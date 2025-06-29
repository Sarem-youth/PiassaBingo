const supabase = require("../config/supabase.config.js");

// Create a new cartela group
exports.createCartelaGroup = async (req, res) => {
  const { name, status } = req.body;

  try {
    const { data, error } = await supabase
      .from("cartela_groups")
      .insert([{ name, status }])
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send(data[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get all cartela groups
exports.getAllCartelaGroups = async (req, res) => {
  try {
    const { data, error } = await supabase.from("cartela_groups").select("*");

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get cartela group by ID
exports.getCartelaGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("cartela_groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send({ message: "Cartela group not found." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update cartela group
exports.updateCartelaGroup = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
    const { data, error } = await supabase
      .from("cartela_groups")
      .update({ name, status })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send(data[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete cartela group
exports.deleteCartelaGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("cartela_groups").delete().eq("id", id);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "Cartela group was deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
