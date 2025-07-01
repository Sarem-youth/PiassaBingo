const supabase = require("../config/supabase.config.js");

// Transfer credit from Admin to Super Agent
exports.sendCreditToAgent = async (req, res) => {
  const { sender_id, receiver_id, amount } = req.body;

  try {
    const { error } = await supabase.rpc('transfer_credit', {
      sender_id_in: sender_id,
      receiver_id_in: receiver_id,
      amount_in: amount,
      type_in: 'admin-to-agent'
    });

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "Credit sent to agent successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Transfer credit from Super Agent to Shop
exports.sendCreditToShop = async (req, res) => {
  const { sender_id, receiver_id, amount } = req.body;

  try {
    const { error } = await supabase.rpc('transfer_credit', {
      sender_id_in: sender_id,
      receiver_id_in: receiver_id,
      amount_in: amount,
      type_in: 'agent-to-shop'
    });

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "Credit sent to shop successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get credit report for agents
exports.getAgentCreditReport = async (req, res) => {
  const { page = 0, limit = 10, search = '' } = req.query;
  const offset = page * limit;

  try {
    let query = supabase
      .from("credits")
      .select(`
        *,
        sender:sender_id ( username ),
        receiver:receiver_id ( username )
      `, { count: "exact" })
      .eq('type', 'admin-to-agent');

    if (search) {
      query = query.or(`sender.username.ilike.%${search}%,receiver.username.ilike.%${search}%`);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ credits: data, count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get credit report for shops
exports.getShopCreditReport = async (req, res) => {
  const { page = 0, limit = 10, search = '' } = req.query;
  const offset = page * limit;

  try {
    let query = supabase
      .from("credits")
      .select(`
        *,
        sender:sender_id ( username ),
        receiver:receiver_id ( username )
      `, { count: "exact" })
      .eq('type', 'agent-to-shop');

    if (search) {
      query = query.or(`sender.username.ilike.%${search}%,receiver.username.ilike.%${search}%`);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ credits: data, count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get received credit report for a user
exports.getReceivedCreditReport = async (req, res) => {
  const { userId, page = 0, limit = 10, search = '' } = req.query;
  const offset = page * limit;

  try {
    let query = supabase
      .from("credits")
      .select(`
        *,
        sender:sender_id ( username )
      `, { count: "exact" })
      .eq('receiver_id', userId);

    if (search) {
      query = query.ilike('sender.username', `%${search}%`);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ credits: data, count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Recharge balance for admin
exports.rechargeBalance = async (req, res) => {
  const { receiver_id, amount } = req.body; // Admin is the receiver

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', receiver_id)
      .single();

    if (fetchError) {
      return res.status(400).send({ message: "User not found." });
    }

    const newBalance = user.balance + amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', receiver_id);

    if (updateError) {
      return res.status(400).send({ message: updateError.message });
    }

    const { error: creditError } = await supabase
      .from('credits')
      .insert([{
        amount,
        type: 'recharge',
        receiver_id,
      }]);

    if (creditError) {
      console.error("Error creating credit record for recharge:", creditError.message);
    }

    res.status(200).send({ message: "Balance recharged successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get credits by user
exports.getCreditsByUser = async (req, res) => {
  const { userId } = req.params;
  const { page = 0, limit = 10 } = req.query;
  const offset = page * limit;

  try {
    const { data, error, count } = await supabase
      .from('credits')
      .select(`
        id,
        created_at,
        amount,
        type,
        sender:sender_id ( username ),
        receiver:receiver_id ( username )
      `, { count: 'exact' })
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ credits: data, count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Create a new credit record
exports.createCredit = async (req, res) => {
  const { sender_id, receiver_id, amount, type } = req.body;

  try {
    const { data, error } = await supabase
      .from('credits')
      .insert([{
        sender_id,
        receiver_id,
        amount,
        type
      }])
      .select();

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send({ message: "Credit created successfully.", credit: data[0] });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get all credits with pagination
exports.getAllCredits = async (req, res) => {
  const { page = 0, limit = 10, search = '' } = req.query;
  const offset = page * limit;

  try {
    let query = supabase
      .from("credits")
      .select(`
        *,
        sender:sender_id ( username ),
        receiver:receiver_id ( username )
      `, { count: "exact" })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`sender.username.ilike.%${search}%,receiver.username.ilike.%${search}%`);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ credits: data, count });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get credit by ID
exports.getCreditById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('credits')
      .select(`
        *,
        sender:sender_id ( username ),
        receiver:receiver_id ( username )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).send({ message: "Credit not found." });
    }

    res.status(200).send({ credit: data });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Transfer credit using the stored procedure
exports.transferCredit = async (req, res) => {
  const { sender_id, receiver_id, amount, type } = req.body;

  try {
    const { error } = await supabase.rpc('transfer_credit', {
      sender_id_in: sender_id,
      receiver_id_in: receiver_id,
      amount_in: amount,
      type_in: type
    });

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({ message: "Credit transferred successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
