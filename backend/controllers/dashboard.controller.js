const supabase = require("../config/supabase.config.js");

exports.getDashboardData = async (req, res) => {
  try {
    const { date, agent, shop } = req.query;

    let salesQuery = supabase.from('sales_overview').select('*');
    let distributionQuery = supabase.from('sales_distribution').select('*');

    if (date) {
      salesQuery = salesQuery.eq('sale_date', date);
      distributionQuery = distributionQuery.eq('sale_date', date);
    }

    if (agent) {
      salesQuery = salesQuery.eq('agent_id', agent);
      distributionQuery = distributionQuery.eq('agent_id', agent);
    }

    if (shop) {
      salesQuery = salesQuery.eq('shop_id', shop);
      distributionQuery = distributionQuery.eq('shop_id', shop);
    }

    const [salesResult, distributionResult] = await Promise.all([
      salesQuery,
      distributionQuery
    ]);

    if (salesResult.error) {
      return res.status(400).send({ message: salesResult.error.message });
    }

    if (distributionResult.error) {
      return res.status(400).send({ message: distributionResult.error.message });
    }

    res.status(200).send({ sales: salesResult.data, distribution: distributionResult.data });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
