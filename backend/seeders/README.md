# Database Seeders

This directory contains database seeding scripts for the Piassa Bingo application.

## Overview

The seeders create dummy data for development and testing purposes, including:

- **Users**: Admin, agents, shops, and cashiers with different roles and permissions
- **Cartela Groups**: Sample game groups (Morning, Afternoon, Evening)
- **Cartelas**: 100 cartelas per group, numbered 1-100

## Usage

### Run All Seeders
```bash
npm run seed
```

### Run Individual Seeders
```bash
# Seed only users
npm run seed:users

# Seed only cartela data
npm run seed:cartelas
```

## Default User Accounts

After running the seeders, you can log in with these accounts:

| Role    | Email                     | Password   | Balance   | Commission Rate |
|---------|---------------------------|------------|-----------|-----------------|
| Admin   | admin@piassabingo.com     | admin123   | 100,000   | 0%              |
| Agent   | agent1@piassabingo.com    | agent123   | 5,000     | 10%             |
| Shop    | shop1@piassabingo.com     | shop123    | 2,000     | 15%             |
| Cashier | cashier1@piassabingo.com  | cashier123 | 1,000     | 5%              |
| Cashier | cashier2@piassabingo.com  | cashier123 | 1,000     | 5%              |

## Important Notes

1. **Idempotent**: The seeders check for existing data and skip creation if records already exist
2. **Supabase Integration**: Users are created in both Supabase Auth and the public users table
3. **Error Handling**: Failed user creations are cleaned up automatically
4. **Rate Limiting**: Includes delays between operations to avoid API rate limits

## Files

- `index.js` - Main seeder that runs all operations
- `seed-users.js` - Creates dummy user accounts
- `seed-cartelas.js` - Creates cartela groups and cartelas
- `README.md` - This documentation

## Prerequisites

Make sure your `.env` file in the backend directory contains the correct Supabase configuration:

```env
SUPABASE_KEY=your_supabase_anon_key
```

The Supabase URL is configured in `config/supabase.config.js`.

## Troubleshooting

- **User creation fails**: Check your Supabase project settings and ensure the service role key has admin permissions
- **Rate limiting**: The seeders include delays, but you may need to increase them for slower connections
- **Existing data**: The seeders will skip creation if data already exists (check logs for details)
