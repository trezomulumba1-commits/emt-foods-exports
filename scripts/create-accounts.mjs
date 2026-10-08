import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env', quiet: true });
config({ path: '.env.local', override: true, quiet: true });

const required = [
  'VITE_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SEED_USER_EMAIL',
  'SEED_USER_PASSWORD',
  'SEED_ADMIN_EMAIL',
  'SEED_ADMIN_PASSWORD',
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Add them to a local, uncommitted .env file before running npm run create:accounts.');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const findUserByEmail = async email => {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const found = data.users.find(user => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < perPage) return null;
    page += 1;
  }
};

const upsertAccount = async ({ email, password, fullName, companyName, isAdmin }) => {
  const existing = await findUserByEmail(email);
  const metadata = {
    full_name: fullName,
    company_name: companyName,
  };
  const authMetadata = {
    is_admin: isAdmin,
    role: isAdmin ? 'operations_admin' : 'customer',
  };

  const authResult = existing
    ? await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: metadata,
        app_metadata: authMetadata,
      })
    : await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata,
        app_metadata: authMetadata,
      });

  if (authResult.error) throw authResult.error;

  const userId = authResult.data.user.id;
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: fullName,
    company_name: companyName,
    role: isAdmin ? 'operations_admin' : 'customer',
  });

  if (profileError) throw profileError;

  return {
    id: userId,
    email,
    role: isAdmin ? 'admin' : 'user',
    status: existing ? 'updated' : 'created',
  };
};

const main = async () => {
  const accounts = [
    {
      email: process.env.SEED_USER_EMAIL,
      password: process.env.SEED_USER_PASSWORD,
      fullName: process.env.SEED_USER_NAME || 'EMT Client User',
      companyName: process.env.SEED_USER_COMPANY || 'Client Account',
      isAdmin: false,
    },
    {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      fullName: process.env.SEED_ADMIN_NAME || 'EMT Admin User',
      companyName: process.env.SEED_ADMIN_COMPANY || 'EMT Foods Exports',
      isAdmin: true,
    },
  ];

  for (const account of accounts) {
    if (account.password.length < 8) {
      throw new Error(`${account.email} password must be at least 8 characters.`);
    }
  }

  const results = [];
  for (const account of accounts) {
    results.push(await upsertAccount(account));
  }

  console.log('Supabase accounts are ready:');
  for (const result of results) {
    console.log(`- ${result.email} (${result.role}) ${result.status}; profile id ${result.id}`);
  }
};

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
