import { supabase } from './supabase';
import { Usuario, NivelAcesso, PermissoesAcesso } from '@/types';

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  nivelAcesso: NivelAcesso;
  empresaId?: string;
  empresaNome?: string;
  ativo: boolean;
}

const CURRENT_USER_KEY = 'currentUser';

// Fazer login
export async function login(email: string, senha: string): Promise<Usuario> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Usuário não encontrado');

    // Buscar dados do perfil
    const { data: profile, error: profileError } = await supabase
      .from('app_b4d7b_usuarios')
      .select(`
        *,
        empresa:app_b4d7b_empresas(nome)
      `)
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('Perfil não encontrado');

    if (!profile.ativo) {
      await supabase.auth.signOut();
      throw new Error('Usuário inativo');
    }

    const user: Usuario = {
      id: profile.id,
      email: profile.email,
      nome: profile.nome,
      senha: '',
      nivelAcesso: profile.nivel_acesso,
      empresaId: profile.empresa_id,
      empresaNome: profile.empresa?.nome,
      ativo: profile.ativo,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
    console.error('Erro no login:', error);
    throw new Error(errorMessage);
  }
}

// Fazer logout
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Obter usuário atual
export function getCurrentUser(): Usuario | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

// Verificar se está autenticado
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Obter permissões do usuário
export function getPermissoes(user: Usuario | null): PermissoesAcesso {
  if (!user) {
    return {
      podeVisualizarTodos: false,
      podeEditar: false,
      podeCriar: false,
      podeExcluir: false,
      podeGerenciarUsuarios: false,
      apenasPropriaEmpresa: false,
    };
  }

  switch (user.nivelAcesso) {
    case 'administrador':
      return {
        podeVisualizarTodos: true,
        podeEditar: true,
        podeCriar: true,
        podeExcluir: true,
        podeGerenciarUsuarios: true,
        apenasPropriaEmpresa: false,
      };
    case 'editor':
      return {
        podeVisualizarTodos: true,
        podeEditar: true,
        podeCriar: true,
        podeExcluir: false,
        podeGerenciarUsuarios: false,
        apenasPropriaEmpresa: false,
      };
    case 'terceiro':
      return {
        podeVisualizarTodos: false,
        podeEditar: false,
        podeCriar: false,
        podeExcluir: false,
        podeGerenciarUsuarios: false,
        apenasPropriaEmpresa: true,
      };
    default:
      return {
        podeVisualizarTodos: false,
        podeEditar: false,
        podeCriar: false,
        podeExcluir: false,
        podeGerenciarUsuarios: false,
        apenasPropriaEmpresa: false,
      };
  }
}

// Criar novo usuário (apenas admin)
export async function createUser(userData: {
  email: string;
  senha: string;
  nome: string;
  nivelAcesso: NivelAcesso;
  empresaId?: string;
}): Promise<Usuario> {
  try {
    // Criar usuário no auth usando edge function
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: userData
    });

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário';
    console.error('Erro ao criar usuário:', error);
    throw new Error(errorMessage);
  }
}

// Recuperar senha
export async function recoverPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

// Atualizar senha
export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

// Buscar todos os usuários (apenas admin)
export async function getUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from('app_b4d7b_usuarios')
    .select(`
      *,
      empresa:app_b4d7b_empresas(nome)
    `)
    .order('nome');

  if (error) throw error;

  return (data || []).map(u => ({
    id: u.id,
    email: u.email,
    nome: u.nome,
    senha: '',
    nivelAcesso: u.nivel_acesso,
    empresaId: u.empresa_id,
    empresaNome: u.empresa?.nome,
    ativo: u.ativo,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }));
}

// Atualizar usuário
export async function updateUser(id: string, dados: Partial<Usuario>): Promise<Usuario | null> {
  const updateData: Record<string, string | boolean | undefined> = {};
  
  if (dados.nome !== undefined) updateData.nome = dados.nome;
  if (dados.email !== undefined) updateData.email = dados.email;
  if (dados.nivelAcesso !== undefined) updateData.nivel_acesso = dados.nivelAcesso;
  if (dados.empresaId !== undefined) updateData.empresa_id = dados.empresaId;
  if (dados.ativo !== undefined) updateData.ativo = dados.ativo;

  const { data, error } = await supabase
    .from('app_b4d7b_usuarios')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      empresa:app_b4d7b_empresas(nome)
    `)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    nome: data.nome,
    senha: '',
    nivelAcesso: data.nivel_acesso,
    empresaId: data.empresa_id,
    empresaNome: data.empresa?.nome,
    ativo: data.ativo,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Deletar usuário
export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('app_b4d7b_usuarios')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Inicializar dados padrão (manter para compatibilidade)
export function initializeDefaultData() {
  // Não faz nada - dados já estão no Supabase
}