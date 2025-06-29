-- Create the credits table
CREATE TABLE credits (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  amount NUMERIC NOT NULL,
  type VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the transfer_credit function
CREATE OR REPLACE FUNCTION transfer_credit(
  sender_id_in UUID,
  receiver_id_in UUID,
  amount_in NUMERIC,
  type_in VARCHAR(255)
)
RETURNS VOID AS $$
BEGIN
  -- Decrease sender's balance
  UPDATE users
  SET balance = balance - amount_in
  WHERE id = sender_id_in;

  -- Increase receiver's balance
  UPDATE users
  SET balance = balance + amount_in
  WHERE id = receiver_id_in;

  -- Record the transaction
  INSERT INTO credits (sender_id, receiver_id, amount, type)
  VALUES (sender_id_in, receiver_id_in, amount_in, type_in);
END;
$$ LANGUAGE plpgsql;
