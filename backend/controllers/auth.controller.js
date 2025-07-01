const supabase = require("../config/supabase.config.js");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const bcrypt = require('bcryptjs');

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Signin attempt for username:', username);
    
    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('id, username, role, password_hash') // Include password hash
      .eq('username', username)
      .single();

    console.log('User query result:', { userDetails, userError });

    if (userError || !userDetails) {
      console.log('User not found or error occurred');
      return res.status(401).send({ message: "Invalid username or password." });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      userDetails.password_hash
    );

    console.log('Password comparison result:', passwordIsValid);

    if (!passwordIsValid) {
      console.log('Password validation failed');
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign(
      { 
        id: userDetails.id,
        username: userDetails.username,
        role: userDetails.role 
      },
      config.secret,
      { expiresIn: 86400 } // 24 hours
    );

    res.status(200).send({
      id: userDetails.id,
      username: userDetails.username,
      role: userDetails.role,
      accessToken: token,
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password, roles, name, phone } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password, // Supabase still needs a password
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
      // Add user to the public.users table with hashed password
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            id: authData.user.id, 
            username: username, 
            email: email, 
            role: roles && roles.length > 0 ? roles[0] : 'user',
            password_hash: hashedPassword, // Store the hashed password
            name: name,
            phone: phone
          },
        ]);

      if (userError) {
        console.error("Error adding user to public.users:", userError.message);
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
