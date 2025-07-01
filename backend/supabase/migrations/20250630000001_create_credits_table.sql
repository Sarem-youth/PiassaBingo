-- Create credit transaction type
CREATE TYPE public.credit_transaction_type AS ENUM ('admin-to-agent', 'agent-to-shop', 'recharge');

-- Create credits table
CREATE TABLE public.credits (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID NOT NULL REFERENCES public.users(id),
  amount NUMERIC(10, 2) NOT NULL,
  type credit_transaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

-- Policies for credits table
CREATE POLICY "Allow users to see their own credit transactions" ON public.credits FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

CREATE POLICY "Allow admin to see all credit transactions" ON public.credits FOR SELECT USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- Create the transfer_credit function
CREATE OR REPLACE FUNCTION transfer_credit(
  sender_id_in UUID,
  receiver_id_in UUID,
  amount_in NUMERIC,
  type_in text
)
RETURNS VOID AS $$
declare
  sender_balance numeric;
begin
  -- Check sender balance
  select balance into sender_balance from public.users where id = sender_id_in;
  if sender_balance is null or sender_balance < amount_in then
    raise exception 'Insufficient balance';
  end if;

  -- Update sender balance
  update public.users set balance = balance - amount_in where id = sender_id_in;

  -- Update receiver balance
  update public.users set balance = balance + amount_in where id = receiver_id_in;

  -- Record the transaction
  insert into public.credits(sender_id, receiver_id, amount, type)
  values (sender_id_in, receiver_id_in, amount_in, type_in::public.credit_transaction_type);
end;
$$ LANGUAGE plpgsql;
