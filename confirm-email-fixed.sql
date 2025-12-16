-- ============================================
-- SCRIPT CORRIGIDO PARA CONFIRMAR EMAIL E CRIAR USUÁRIO ADMIN
-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/sql/new
-- ============================================

-- PASSO 1: Confirmar o email do usuário no auth.users
-- REMOVIDO o campo confirmed_at pois é gerado automaticamente
UPDATE auth.users
SET email_confirmed_at = now()
WHERE id = '0fc60033-ed15-4f43-94f4-f7e93d60ca96';

-- PASSO 2: Inserir o usuário na tabela app_b4d7b_usuarios
INSERT INTO app_b4d7b_usuarios (id, nome, email, nivel_acesso, ativo)
VALUES ('0fc60033-ed15-4f43-94f4-f7e93d60ca96', 'Dairel Bomfim', 'dairel.bomfim@unicogroup.com.br', 'administrador', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  nivel_acesso = EXCLUDED.nivel_acesso,
  ativo = EXCLUDED.ativo,
  updated_at = timezone('utc'::text, now());

-- PASSO 3: Verificar se tudo funcionou
SELECT 
  'Email confirmado em:' as status,
  email,
  email_confirmed_at,
  confirmed_at
FROM auth.users 
WHERE id = '0fc60033-ed15-4f43-94f4-f7e93d60ca96';

SELECT 
  'Usuário na tabela:' as status,
  id, 
  nome, 
  email, 
  nivel_acesso, 
  ativo,
  created_at
FROM app_b4d7b_usuarios 
WHERE id = '0fc60033-ed15-4f43-94f4-f7e93d60ca96';

-- ✅ Se você ver os dados do usuário nas duas consultas acima, ESTÁ PRONTO!
-- 
-- 🚀 Agora você pode fazer login com:
-- Email: dairel.bomfim@unicogroup.com.br
-- Senha: $Log-000-