-- ============================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS
-- Sistema de Controle de Documentação
-- ============================================

BEGIN;

-- ========== CRIAR TABELAS ==========

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS app_b4d7b_empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de usuários (perfis estendidos)
CREATE TABLE IF NOT EXISTS app_b4d7b_usuarios (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  nivel_acesso TEXT NOT NULL CHECK (nivel_acesso IN ('administrador', 'editor', 'terceiro')),
  empresa_id UUID REFERENCES app_b4d7b_empresas(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS app_b4d7b_funcionarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  rg TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  data_admissao DATE NOT NULL,
  cargo TEXT NOT NULL,
  setor TEXT NOT NULL,
  empresa TEXT NOT NULL,
  empresa_id UUID REFERENCES app_b4d7b_empresas(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ativo', 'inativo', 'afastado')),
  observacoes TEXT,
  email TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de tipos de certificado
CREATE TABLE IF NOT EXISTS app_b4d7b_tipos_certificado (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de certificados
CREATE TABLE IF NOT EXISTS app_b4d7b_certificados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID REFERENCES app_b4d7b_funcionarios(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL,
  numero TEXT NOT NULL,
  data_emissao DATE NOT NULL,
  data_validade DATE NOT NULL,
  orgao_emissor TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('valido', 'vencido', 'em_renovacao')),
  arquivo_url TEXT,
  arquivo_nome TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========== CRIAR ÍNDICES ==========

CREATE INDEX IF NOT EXISTS idx_funcionarios_empresa ON app_b4d7b_funcionarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_status ON app_b4d7b_funcionarios(status);
CREATE INDEX IF NOT EXISTS idx_certificados_funcionario ON app_b4d7b_certificados(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_certificados_validade ON app_b4d7b_certificados(data_validade);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa ON app_b4d7b_usuarios(empresa_id);

-- ========== HABILITAR ROW LEVEL SECURITY ==========

ALTER TABLE app_b4d7b_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_b4d7b_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_b4d7b_funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_b4d7b_tipos_certificado ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_b4d7b_certificados ENABLE ROW LEVEL SECURITY;

-- ========== POLÍTICAS RLS - EMPRESAS ==========

DROP POLICY IF EXISTS "Usuários podem ver todas as empresas" ON app_b4d7b_empresas;
CREATE POLICY "Usuários podem ver todas as empresas" ON app_b4d7b_empresas
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Apenas administradores podem criar empresas" ON app_b4d7b_empresas;
CREATE POLICY "Apenas administradores podem criar empresas" ON app_b4d7b_empresas
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

DROP POLICY IF EXISTS "Apenas administradores podem atualizar empresas" ON app_b4d7b_empresas;
CREATE POLICY "Apenas administradores podem atualizar empresas" ON app_b4d7b_empresas
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

DROP POLICY IF EXISTS "Apenas administradores podem deletar empresas" ON app_b4d7b_empresas;
CREATE POLICY "Apenas administradores podem deletar empresas" ON app_b4d7b_empresas
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

-- ========== POLÍTICAS RLS - USUÁRIOS ==========

DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON app_b4d7b_usuarios;
CREATE POLICY "Usuários podem ver seu próprio perfil" ON app_b4d7b_usuarios
  FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON app_b4d7b_usuarios;
CREATE POLICY "Administradores podem ver todos os usuários" ON app_b4d7b_usuarios
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

DROP POLICY IF EXISTS "Apenas administradores podem criar usuários" ON app_b4d7b_usuarios;
CREATE POLICY "Apenas administradores podem criar usuários" ON app_b4d7b_usuarios
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON app_b4d7b_usuarios;
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON app_b4d7b_usuarios
  FOR UPDATE TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "Administradores podem atualizar qualquer usuário" ON app_b4d7b_usuarios;
CREATE POLICY "Administradores podem atualizar qualquer usuário" ON app_b4d7b_usuarios
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

-- ========== POLÍTICAS RLS - FUNCIONÁRIOS ==========

DROP POLICY IF EXISTS "Administradores e editores podem ver todos os funcionários" ON app_b4d7b_funcionarios;
CREATE POLICY "Administradores e editores podem ver todos os funcionários" ON app_b4d7b_funcionarios
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Usuários terceiros podem ver apenas funcionários de sua empresa" ON app_b4d7b_funcionarios;
CREATE POLICY "Usuários terceiros podem ver apenas funcionários de sua empresa" ON app_b4d7b_funcionarios
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() 
        AND nivel_acesso = 'terceiro' 
        AND empresa_id = app_b4d7b_funcionarios.empresa_id
    )
  );

DROP POLICY IF EXISTS "Administradores e editores podem criar funcionários" ON app_b4d7b_funcionarios;
CREATE POLICY "Administradores e editores podem criar funcionários" ON app_b4d7b_funcionarios
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Administradores e editores podem atualizar funcionários" ON app_b4d7b_funcionarios;
CREATE POLICY "Administradores e editores podem atualizar funcionários" ON app_b4d7b_funcionarios
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Apenas administradores podem deletar funcionários" ON app_b4d7b_funcionarios;
CREATE POLICY "Apenas administradores podem deletar funcionários" ON app_b4d7b_funcionarios
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

-- ========== POLÍTICAS RLS - TIPOS DE CERTIFICADO ==========

DROP POLICY IF EXISTS "Todos podem ver tipos de certificado" ON app_b4d7b_tipos_certificado;
CREATE POLICY "Todos podem ver tipos de certificado" ON app_b4d7b_tipos_certificado
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Administradores e editores podem criar tipos de certificado" ON app_b4d7b_tipos_certificado;
CREATE POLICY "Administradores e editores podem criar tipos de certificado" ON app_b4d7b_tipos_certificado
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Administradores e editores podem atualizar tipos de certificado" ON app_b4d7b_tipos_certificado;
CREATE POLICY "Administradores e editores podem atualizar tipos de certificado" ON app_b4d7b_tipos_certificado
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Apenas administradores podem deletar tipos de certificado" ON app_b4d7b_tipos_certificado;
CREATE POLICY "Apenas administradores podem deletar tipos de certificado" ON app_b4d7b_tipos_certificado
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

-- ========== POLÍTICAS RLS - CERTIFICADOS ==========

DROP POLICY IF EXISTS "Administradores e editores podem ver todos os certificados" ON app_b4d7b_certificados;
CREATE POLICY "Administradores e editores podem ver todos os certificados" ON app_b4d7b_certificados
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Usuários terceiros podem ver certificados de funcionários de sua empresa" ON app_b4d7b_certificados;
CREATE POLICY "Usuários terceiros podem ver certificados de funcionários de sua empresa" ON app_b4d7b_certificados
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios u
      INNER JOIN app_b4d7b_funcionarios f ON f.empresa_id = u.empresa_id
      WHERE u.id = auth.uid() 
        AND u.nivel_acesso = 'terceiro'
        AND f.id = app_b4d7b_certificados.funcionario_id
    )
  );

DROP POLICY IF EXISTS "Administradores e editores podem criar certificados" ON app_b4d7b_certificados;
CREATE POLICY "Administradores e editores podem criar certificados" ON app_b4d7b_certificados
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Administradores e editores podem atualizar certificados" ON app_b4d7b_certificados;
CREATE POLICY "Administradores e editores podem atualizar certificados" ON app_b4d7b_certificados
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Apenas administradores podem deletar certificados" ON app_b4d7b_certificados;
CREATE POLICY "Apenas administradores podem deletar certificados" ON app_b4d7b_certificados
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso = 'administrador'
    )
  );

-- ========== CRIAR BUCKET DE STORAGE ==========

INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificados', 'certificados', true) 
ON CONFLICT (id) DO NOTHING;

-- ========== POLÍTICAS DE STORAGE ==========

DROP POLICY IF EXISTS "Usuários autenticados podem ver certificados" ON storage.objects;
CREATE POLICY "Usuários autenticados podem ver certificados" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'certificados');

DROP POLICY IF EXISTS "Administradores e editores podem fazer upload de certificados" ON storage.objects;
CREATE POLICY "Administradores e editores podem fazer upload de certificados" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'certificados' AND
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

DROP POLICY IF EXISTS "Administradores e editores podem deletar certificados" ON storage.objects;
CREATE POLICY "Administradores e editores podem deletar certificados" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'certificados' AND
    EXISTS (
      SELECT 1 FROM app_b4d7b_usuarios 
      WHERE id = auth.uid() AND nivel_acesso IN ('administrador', 'editor')
    )
  );

-- ========== DADOS INICIAIS (OPCIONAL) ==========

-- Criar empresa padrão
INSERT INTO app_b4d7b_empresas (id, nome)
VALUES ('00000000-0000-0000-0000-000000000001', 'Unico Facilities')
ON CONFLICT (id) DO NOTHING;

-- Inserir tipos de certificado padrão
INSERT INTO app_b4d7b_tipos_certificado (tipo, observacoes) VALUES
  ('ASO', 'Atestado de Saúde Ocupacional'),
  ('NR-10', 'Segurança em Instalações e Serviços em Eletricidade'),
  ('NR-35', 'Trabalho em Altura'),
  ('NR-33', 'Segurança e Saúde nos Trabalhos em Espaços Confinados'),
  ('NR-12', 'Segurança no Trabalho em Máquinas e Equipamentos'),
  ('NR-18', 'Condições e Meio Ambiente de Trabalho na Indústria da Construção'),
  ('NR-20', 'Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis'),
  ('CIPA', 'Comissão Interna de Prevenção de Acidentes'),
  ('Integração', 'Treinamento de Integração'),
  ('Outro', 'Outros tipos de certificados')
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- IMPORTANTE: Após executar este script, você precisa:
-- 1. Criar o primeiro usuário administrador manualmente no Supabase Auth
-- 2. Depois inserir o perfil dele na tabela app_b4d7b_usuarios
-- 
-- Exemplo para criar perfil de admin após criar usuário no Auth:
-- INSERT INTO app_b4d7b_usuarios (id, nome, email, nivel_acesso, ativo)
-- VALUES ('UUID_DO_USUARIO_AUTH', 'Admin', 'admin@unicofacilities.com.br', 'administrador', true);