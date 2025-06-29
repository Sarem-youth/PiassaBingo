create or replace function transfer_credit(sender_id_in uuid, receiver_id_in uuid, amount_in numeric, type_in text)
returns void as $$
declare
  sender_balance numeric;
begin
  -- Check sender balance
  select balance into sender_balance from public.users where id = sender_id_in;
  if sender_balance < amount_in then
    raise exception 'Insufficient balance';
  end if;

  -- Update sender balance
  update public.users set balance = balance - amount_in where id = sender_id_in;

  -- Update receiver balance
  update public.users set balance = balance + amount_in where id = receiver_id_in;

  -- Insert into credits table
  insert into public.credits(sender_id, receiver_id, amount, type)
  values (sender_id_in, receiver_id_in, amount_in, type_in);
end;
$$ language plpgsql;
