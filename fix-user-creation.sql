-- ============================================
-- SCRIPT PARA CRIAR USUÁRIO ADMIN
-- Execute este script no Supabase SQL Editor
-- ============================================

-- IMPORTANTE: Este script cria o usuário APENAS na tabela
-- Você PRECISA criar o usuário no Authentication PRIMEIRO!

-- PASSO 1: Vá para Authentication → Users e crie o usuário:
-- Email: dairel.bomfim@unicogroup.com.br
-- Senha: $Log-000-
-- ✅ MARQUE: Auto Confirm User

-- PASSO 2: Copie o UUID que foi gerado (algo como: 0fc60033-ed15-4f43-94f4-f7e93d60ca96)

-- PASSO 3: Execute este SQL substituindo 'SEU_UUID_AQUI' pelo UUID copiado:

-- Primeiro, vamos verificar se já existe algum usuário
SELECT 'Usuários existentes:' as info;
SELECT id, nome, email, nivel_acesso, ativo FROM app_b4d7b_usuarios;

-- Se a tabela estiver vazia, execute o INSERT abaixo:
-- SUBSTITUA 'SEU_UUID_AQUI' pelo UUID que você copiou do Authentication!

INSERT INTO app_b4d7b_usuarios (id, nome, email, nivel_acesso, ativo)
VALUES ('SEU_UUID_AQUI', 'Dairel Bomfim', 'dairel.bomfim@unicogroup.com.br', 'administrador', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  nivel_acesso = EXCLUDED.nivel_acesso,
  ativo = EXCLUDED.ativo,
  updated_at = timezone('utc'::text, now());

-- Verificar se o usuário foi inserido
SELECT 'Usuário criado com sucesso:' as info;
SELECT id, nome, email, nivel_acesso, ativo FROM app_b4d7b_usuarios WHERE email = 'dairel.bomfim@unicogroup.com.br';