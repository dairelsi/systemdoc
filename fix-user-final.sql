-- ============================================
-- SCRIPT FINAL PARA CRIAR USUÁRIO ADMIN
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- UUID do usuário: 0fc60033-ed15-4f43-94f4-f7e93d60ca96

-- PASSO 1: Inserir o usuário na tabela (usando service_role para bypass RLS)
INSERT INTO app_b4d7b_usuarios (id, nome, email, nivel_acesso, ativo)
VALUES ('0fc60033-ed15-4f43-94f4-f7e93d60ca96', 'Dairel Bomfim', 'dairel.bomfim@unicogroup.com.br', 'administrador', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  nivel_acesso = EXCLUDED.nivel_acesso,
  ativo = EXCLUDED.ativo,
  updated_at = timezone('utc'::text, now());

-- PASSO 2: Verificar se o usuário foi inserido
SELECT 'Usuário criado com sucesso:' as status;
SELECT id, nome, email, nivel_acesso, ativo 
FROM app_b4d7b_usuarios 
WHERE id = '0fc60033-ed15-4f43-94f4-f7e93d60ca96';