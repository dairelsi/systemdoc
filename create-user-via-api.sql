-- Solução alternativa: Usar a API Admin do Supabase para criar o usuário
-- Este método garante que a senha será criptografada corretamente

-- Primeiro, vamos deletar o usuário existente
BEGIN;

DELETE FROM app_b4d7b_usuarios 
WHERE email = 'dairel.bomfim@unicogroup.com.br';

DELETE FROM auth.users 
WHERE email = 'dairel.bomfim@unicogroup.com.br';

COMMIT;

-- Agora você precisa usar a API Admin do Supabase
-- Execute este comando no seu terminal ou use o Supabase Dashboard

-- OPÇÃO 1: Via Dashboard do Supabase
-- 1. Vá para: https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/auth/users
-- 2. Clique em "Add user" (botão verde no canto superior direito)
-- 3. Selecione "Create new user"
-- 4. Preencha:
--    - Email: dairel.bomfim@unicogroup.com.br
--    - Password: $Log-000-
--    - Auto Confirm User: MARQUE ESTA OPÇÃO (muito importante!)
-- 5. Clique em "Create user"
-- 6. Copie o UUID do usuário criado
-- 7. Execute o SQL abaixo substituindo USER_UUID_AQUI pelo UUID copiado

-- OPÇÃO 2: Via SQL (depois de criar o usuário no Dashboard)
-- Substitua USER_UUID_AQUI pelo UUID do usuário criado no Dashboard
/*
INSERT INTO app_b4d7b_usuarios (
  id,
  email,
  nome,
  nivel_acesso,
  ativo,
  created_at,
  updated_at
) VALUES (
  'USER_UUID_AQUI',
  'dairel.bomfim@unicogroup.com.br',
  'Dairel Bomfim',
  'administrador',
  true,
  NOW(),
  NOW()
);
*/

-- Verificar depois de criar
SELECT 
  'Auth User' as tipo,
  id, 
  email, 
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'dairel.bomfim@unicogroup.com.br';

SELECT 
  'App User' as tipo,
  id, 
  nome, 
  email, 
  nivel_acesso, 
  ativo
FROM app_b4d7b_usuarios 
WHERE email = 'dairel.bomfim@unicogroup.com.br';