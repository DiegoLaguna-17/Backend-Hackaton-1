const { createClient } = require('@supabase/supabase-js');


if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Faltan variables SUPABASE_URL o SUPABASE_KEY');
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
        auth: {
            persistSession: false
        }
    }
);

module.exports = supabase;