const supabase = require("../config/supabase.config.js");

// Create a new game
exports.createGame = async (req, res) => {
  const { shopId, settings } = req.body;

  try {
    const { data, error } = await supabase
      .from("games")
      .insert([{ shop_id: shopId, settings, status: "pending" }])
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send(data[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get all games
exports.getAllGames = async (req, res) => {
  try {
    const { data, error } = await supabase.from("games").select("*");

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get game by ID
exports.getGameById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send({ message: "Game not found." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update game
exports.updateGame = async (req, res) => {
  const { id } = req.params;
  const { settings, status, drawn_numbers } = req.body;

  try {
    const { data, error } = await supabase
      .from("games")
      .update({ settings, status, drawn_numbers })
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

// Delete game
exports.deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("games").delete().eq("id", id);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "Game was deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Start a game
exports.startGame = async (req, res) => {
  const { id } = req.params;
  const { winning_pattern, stake } = req.body;

  try {
    const { data, error } = await supabase
      .from("games")
      .update({
        status: "active",
        winning_pattern,
        stake,
      })
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

// Register a cartela for a game
exports.registerCartela = async (req, res) => {
  const { game_id, cartela_id } = req.body;

  try {
    const { data, error } = await supabase
      .from("game_cartelas")
      .insert([{ game_id, cartela_id }])
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send(data[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Draw a number
exports.drawNumber = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the game
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("drawn_numbers")
      .eq("id", id)
      .single();

    if (gameError) {
      return res.status(400).send({ message: gameError.message });
    }

    // Generate a new number that hasn't been drawn yet
    let newNumber;
    const drawnNumbers = game.drawn_numbers || [];
    do {
      newNumber = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(newNumber));

    // Update the drawn numbers
    const updatedDrawnNumbers = [...drawnNumbers, newNumber];

    const { data, error } = await supabase
      .from("games")
      .update({ drawn_numbers: updatedDrawnNumbers })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ drawn_number: newNumber });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Verify a winner
exports.verifyWinner = async (req, res) => {
  const { game_id, cartela_id } = req.body;

  try {
    // Get the game and cartela details
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("winning_pattern, drawn_numbers")
      .eq("id", game_id)
      .single();

    if (gameError) {
      return res.status(400).send({ message: gameError.message });
    }

    const { data: cartela, error: cartelaError } = await supabase
      .from("cartelas")
      .select("numbers")
      .eq("id", cartela_id)
      .single();

    if (cartelaError) {
      return res.status(400).send({ message: cartelaError.message });
    }

    // Implement the logic to check for a winning pattern.
    // This is a simplified example. You'll need to expand this based on your specific patterns.
    const isWinner = checkForWin(
      cartela.numbers,
      game.drawn_numbers,
      game.winning_pattern
    );

    if (isWinner) {
      // Update game status to 'finished'
      await supabase
        .from("games")
        .update({ status: "finished" })
        .eq("id", game_id);

      res.status(200).send({ winner: true });
    } else {
      res.status(200).send({ winner: false });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
