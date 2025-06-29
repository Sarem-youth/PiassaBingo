const supabase = require("../config/supabase.config.js");

// Create a new cartela
exports.createCartela = async (req, res) => {
  const { cartela_number, status, cartela_group_id } = req.body;

  try {
    const { data, error } = await supabase
      .from("cartelas")
      .insert([{ cartela_number, status, cartela_group_id }])
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send(data[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get all cartelas
exports.getAllCartelas = async (req, res) => {
  try {
    const { data, error } = await supabase.from("cartelas").select("*");

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get cartela by ID
exports.getCartelaById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("cartelas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send({ message: "Cartela not found." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update cartela
exports.updateCartela = async (req, res) => {
  const { id } = req.params;
  const { cartela_number, status, cartela_group_id } = req.body;

  try {
    const { data, error } = await supabase
      .from("cartelas")
      .update({ cartela_number, status, cartela_group_id })
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

// Delete cartela
exports.deleteCartela = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("cartelas").delete().eq("id", id);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "Cartela was deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Bulk create cartelas
exports.bulkCreateCartelas = async (req, res) => {
  const { cartelas } = req.body; // expecting an array of cartelas

  try {
    const { data, error } = await supabase
      .from("cartelas")
      .insert(cartelas)
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
