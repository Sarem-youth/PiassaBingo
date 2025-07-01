-- Create sales_overview view
CREATE OR REPLACE VIEW public.sales_overview AS
SELECT
  g.created_at::date AS sale_date,
  u_shop.parent_id AS agent_id,
  g.shop_id,
  COUNT(gc.cartela_id) AS total_cartelas_sold,
  SUM(g.stake) AS total_sales_amount
FROM public.game_cartelas gc
JOIN public.games g ON gc.game_id = g.id
JOIN public.users u_shop ON g.shop_id = u_shop.id
WHERE g.status = 'finished'
GROUP BY
  g.created_at::date,
  u_shop.parent_id,
  g.shop_id;

-- Create sales_distribution view
CREATE OR REPLACE VIEW public.sales_distribution AS
SELECT
  g.created_at::date AS sale_date,
  u_shop.parent_id AS agent_id,
  g.shop_id,
  u_agent.username AS agent_name,
  u_shop.username AS shop_name,
  COUNT(gc.cartela_id) AS sold_cartelas
FROM public.game_cartelas gc
JOIN public.games g ON gc.game_id = g.id
JOIN public.users u_shop ON g.shop_id = u_shop.id
LEFT JOIN public.users u_agent ON u_shop.parent_id = u_agent.id
WHERE g.status = 'finished'
GROUP BY
  g.created_at::date,
  u_shop.parent_id,
  g.shop_id,
  u_agent.username,
  u_shop.username;
