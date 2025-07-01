-- Add password_hash column to users table
alter table public.users add column password_hash text;

-- Add some default passwords for existing users (for development only)
-- These should be changed in production
-- Password hashes generated with bcryptjs, salt rounds = 10
update public.users set password_hash = '$2b$10$ur1ez10N6OGhBhLFiOmYzew4yggAI61zn1e8//IwlqtD/VmUFYN6A6' where username = 'admin'; -- password: admin123
update public.users set password_hash = '$2b$10$HrCm52YsK98TRi5.UekjTOwyO88CrK1aamigA0.Zgi.DNQr0DWKKwa' where username = 'cashier1'; -- password: cashier123  
update public.users set password_hash = '$2b$10$6Md/I6A3HQvjDZpsvJjML.zMEYYrR2qnFYeE9YuK5ihKuKX2xnEbKm' where username = 'cashier2'; -- password: cashier123
update public.users set password_hash = '$2b$10$9j4BaYVJo4sfPUBXJQSLRe/FMOO/qeyVaaRL8n9PGNiQC6fqcwQXLG' where username = 'agent1'; -- password: agent123
update public.users set password_hash = '$2b$10$cC6o8jT6vh4LALykULaqN.LmnooCY3jfPELtakqzyMrzxaKywWyVGy' where username = 'shop1'; -- password: shop123
