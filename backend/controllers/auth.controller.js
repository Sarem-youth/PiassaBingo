const db = require("../models");
const User = db.user;

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
