const supabase = require("../config/supabase.config.js");

// Create a new user
exports.createUser = async (req, res) => {
  const { username, email, password, role, commission_rate } = req.body;

  try {
    // Create a new user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (authError) {
      return res.status(400).send({ message: authError.message });
    }

    if (authData.user) {
      // Add user to the public.users table
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { id: authData.user.id, username: username, email: email, role: role, commission_rate: commission_rate },
        ]);

      if (userError) {
        // If creating the user in the public table fails, delete the user from auth to keep data consistent
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(500).send({ message: "Error creating user details: " + userError.message });
      }

      res.status(201).send({ message: "User was created successfully!" });
    } else {
        return res.status(500).send({ message: "Something went wrong during user creation." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  const { page = 0, limit = 10, search = '', roles } = req.query;
  const offset = page * limit;

  try {
    let query = supabase.from("users").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("username", `%${search}%`);
    }

    if (roles) {
      const rolesArray = roles.split(',');
      query = query.in("role", rolesArray);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ users: data, count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send({ message: "User not found." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role, status, balance, commission_rate } = req.body;

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (status) updateData.status = status;
  if (balance !== undefined) updateData.balance = balance;
  if (commission_rate !== undefined) updateData.commission_rate = commission_rate;

  try {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "User was updated successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "User was deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
