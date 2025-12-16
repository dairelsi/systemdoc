import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Request received:`, req.method, req.url);

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, senha, nome, nivelAcesso, empresaId } = body;

    if (!email || !senha || !nome || !nivelAcesso) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Creating user:`, email);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (authError) {
      console.error(`[${requestId}] Auth error:`, authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    console.log(`[${requestId}] User created in auth:`, authData.user.id);

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('app_b4d7b_usuarios')
      .insert({
        id: authData.user.id,
        email,
        nome,
        nivel_acesso: nivelAcesso,
        empresa_id: empresaId || null,
        ativo: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error(`[${requestId}] Profile error:`, profileError);
      // Rollback: delete user from auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    console.log(`[${requestId}] User profile created successfully`);

    return new Response(
      JSON.stringify({
        id: profile.id,
        email: profile.email,
        nome: profile.nome,
        senha: '',
        nivelAcesso: profile.nivel_acesso,
        empresaId: profile.empresa_id,
        ativo: profile.ativo,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});