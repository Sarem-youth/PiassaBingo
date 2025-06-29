const supabase = require("../config/supabase.config.js");

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Supabase uses email to sign in, so we'll use the provided username as the email.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      return res.status(401).send({ message: error.message });
    }

    if (data && data.user) {
      // Fetch user details from the public.users table to get the role
      const { data: userDetails, error: userError } = await supabase
        .from('users')
        .select('id, username, role')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        return res.status(500).send({ message: "Error fetching user details: " + userError.message });
      }

      res.status(200).send({
        id: userDetails.id,
        username: userDetails.username,
        role: userDetails.role,
        accessToken: data.session.access_token,
      });
    } else {
        return res.status(404).send({ message: "User not found." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password, roles } = req.body;

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
          { id: authData.user.id, username: username, email: email, role: roles && roles.length > 0 ? roles[0] : 'user' },
        ]);

      if (userError) {
        // If inserting into public.users fails, you might want to delete the user from auth.users to keep things consistent.
        // This part is complex and depends on your desired error handling strategy.
        // For now, we'll just log the error.
        console.error("Error adding user to public.users:", userError.message);
        // Optionally, you could try to delete the user from Supabase auth here
        return res.status(500).send({ message: "Failed to create user profile." });
      }

      res.status(201).send({ message: "User was registered successfully!" });
    } else {
        return res.status(500).send({ message: "Something went wrong during user registration." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    res.status(200).send({ message: "Logged out successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
