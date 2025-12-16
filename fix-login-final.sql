-- SOLUÇÃO FINAL: O usuário existe mas a senha está incorreta
-- Vamos resetar a senha usando a API Admin do Supabase

-- PASSO 1: Primeiro, delete o usuário atual
BEGIN;
DELETE FROM app_b4d7b_usuarios WHERE email = 'dairel.bomfim@unicogroup.com.br';
DELETE FROM auth.users WHERE email = 'dairel.bomfim@unicogroup.com.br';
COMMIT;

-- PASSO 2: Agora você DEVE criar o usuário via Dashboard do Supabase
-- NÃO use SQL para criar o usuário!
-- 
-- Acesse: https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/auth/users
-- Clique em "Add user" (botão verde)
-- Selecione "Create new user"
-- Preencha:
--   Email: dairel.bomfim@unicogroup.com.br
--   Password: Admin123!
--   ✅ MARQUE "Auto Confirm User"
-- Clique em "Create user"
-- COPIE O UUID DO USUÁRIO CRIADO

-- PASSO 3: Depois de criar via Dashboard, execute este SQL
-- Substitua 'UUID_DO_USUARIO' pelo UUID que você copiou
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
  'UUID_DO_USUARIO',
  'dairel.bomfim@unicogroup.com.br',
  'Dairel Bomfim',
  'administrador',
  true,
  NOW(),
  NOW()
);
*/

-- PASSO 4: Verificar
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

-- PASSO 5: Fazer login com:
-- Email: dairel.bomfim@unicogroup.com.br
-- Senha: Admin123!