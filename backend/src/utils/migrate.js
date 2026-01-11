import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { supabaseAdmin } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // Read migration file
    const migrationPath = join(__dirname, '../../supabase/migrations/001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabaseAdmin.client.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          // If RPC doesn't work, try direct query (this might not work with Supabase)
          // For now, we'll just log and let user know to run manually
          if (error) {
            console.warn('Note: Automatic migration may not work. Please run migration manually in Supabase SQL Editor.');
            console.warn('Migration file:', migrationPath);
            break;
          }
        } catch (err) {
          console.warn('Migration statement failed (this is expected - Supabase requires manual migration):', err.message);
        }
      }
    }
    
    console.log('Migration check complete. Please run the SQL migration manually in Supabase Dashboard → SQL Editor');
    console.log('File location:', migrationPath);
    
  } catch (error) {
    console.error('Migration error:', error);
    console.log('\nPlease run the migration manually:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy contents of backend/supabase/migrations/001_initial_schema.sql');
    console.log('3. Paste and execute');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };

