-- Script corrigido para resetar e recriar o usuário
-- Remove a coluna confirmed_at que é gerada automaticamente
-- Execute este script no Supabase SQL Editor

BEGIN;

-- 1. Deletar usuário da tabela app_b4d7b_usuarios (se existir)
DELETE FROM app_b4d7b_usuarios 
WHERE email = 'dairel.bomfim@unicogroup.com.br';

-- 2. Deletar usuário do auth.users (se existir)
DELETE FROM auth.users 
WHERE email = 'dairel.bomfim@unicogroup.com.br';

-- 3. Criar novo usuário no auth.users com email já confirmado
-- NOTA: confirmed_at é uma coluna gerada, não inserimos manualmente
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'dairel.bomfim@unicogroup.com.br',
  crypt('$Log-000-', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  false
);

-- 4. Inserir usuário na tabela app_b4d7b_usuarios
INSERT INTO app_b4d7b_usuarios (
  id,
  email,
  nome,
  nivel_acesso,
  ativo,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'dairel.bomfim@unicogroup.com.br'),
  'dairel.bomfim@unicogroup.com.br',
  'Dairel Bomfim',
  'administrador',
  true,
  NOW(),
  NOW()
);

COMMIT;

-- Verificar se foi criado com sucesso
SELECT 
  'Auth User' as tipo,
  id, 
  email, 
  email_confirmed_at,
  confirmed_at,
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