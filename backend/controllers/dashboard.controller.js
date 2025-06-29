const supabase = require("../config/supabase.config.js");

exports.getDashboardData = async (req, res) => {
  try {
    const { data: sales, error: salesError } = await supabase
      .from('sales_overview')
      .select('*');

    if (salesError) {
      return res.status(400).send({ message: salesError.message });
    }

    const { data: distribution, error: distributionError } = await supabase
      .from('sales_distribution')
      .select('*');

    if (distributionError) {
      return res.status(400).send({ message: distributionError.message });
    }

    res.status(200).send({ sales, distribution });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
