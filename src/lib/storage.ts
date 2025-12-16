import { supabase, uploadFile, deleteFile, getPublicUrl } from './supabase';
import { 
  Funcionario, 
  Certificado, 
  TipoCertificadoBase,
  DashboardStats 
} from '@/types';

// ========== EMPRESAS ==========
export async function getEmpresas(): Promise<Array<{ id: string; nome: string }>> {
  const { data, error } = await supabase
    .from('app_b4d7b_empresas')
    .select('id, nome')
    .order('nome');

  if (error) throw error;
  return data || [];
}

export async function createEmpresa(nome: string) {
  const { data, error } = await supabase
    .from('app_b4d7b_empresas')
    .insert({ nome })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========== TIPOS DE CERTIFICADO ==========
export async function getTiposCertificado(): Promise<TipoCertificadoBase[]> {
  const { data, error } = await supabase
    .from('app_b4d7b_tipos_certificado')
    .select('*')
    .order('tipo');

  if (error) throw error;

  return (data || []).map(t => ({
    id: t.id,
    tipo: t.tipo,
    observacoes: t.observacoes,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }));
}

export async function addTipoCertificado(
  tipo: Omit<TipoCertificadoBase, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TipoCertificadoBase> {
  const { data, error } = await supabase
    .from('app_b4d7b_tipos_certificado')
    .insert({
      tipo: tipo.tipo,
      observacoes: tipo.observacoes,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    tipo: data.tipo,
    observacoes: data.observacoes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateTipoCertificado(
  id: string,
  dados: Partial<TipoCertificadoBase>
): Promise<TipoCertificadoBase | null> {
  const updateData: Record<string, string | undefined> = {};
  if (dados.tipo !== undefined) updateData.tipo = dados.tipo;
  if (dados.observacoes !== undefined) updateData.observacoes = dados.observacoes;

  const { data, error } = await supabase
    .from('app_b4d7b_tipos_certificado')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    tipo: data.tipo,
    observacoes: data.observacoes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteTipoCertificado(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('app_b4d7b_tipos_certificado')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ========== FUNCIONÁRIOS ==========
export async function getFuncionarios(): Promise<Funcionario[]> {
  const { data, error } = await supabase
    .from('app_b4d7b_funcionarios')
    .select(`
      *,
      empresa:app_b4d7b_empresas(nome)
    `)
    .order('nome');

  if (error) throw error;

  return (data || []).map(f => ({
    id: f.id,
    nome: f.nome,
    cpf: f.cpf,
    rg: f.rg,
    dataNascimento: f.data_nascimento,
    dataAdmissao: f.data_admissao,
    cargo: f.cargo,
    setor: f.setor,
    empresa: f.empresa,
    empresaId: f.empresa_id,
    empresaNome: f.empresa?.nome,
    status: f.status,
    observacoes: f.observacoes,
    email: f.email,
    telefone: f.telefone,
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  }));
}

export async function getFuncionarioById(id: string): Promise<Funcionario | undefined> {
  const { data, error } = await supabase
    .from('app_b4d7b_funcionarios')
    .select(`
      *,
      empresa:app_b4d7b_empresas(nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return undefined;

  return {
    id: data.id,
    nome: data.nome,
    cpf: data.cpf,
    rg: data.rg,
    dataNascimento: data.data_nascimento,
    dataAdmissao: data.data_admissao,
    cargo: data.cargo,
    setor: data.setor,
    empresa: data.empresa,
    empresaId: data.empresa_id,
    empresaNome: data.empresa?.nome,
    status: data.status,
    observacoes: data.observacoes,
    email: data.email,
    telefone: data.telefone,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function addFuncionario(
  funcionario: Omit<Funcionario, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Funcionario> {
  const { data, error } = await supabase
    .from('app_b4d7b_funcionarios')
    .insert({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      rg: funcionario.rg,
      data_nascimento: funcionario.dataNascimento,
      data_admissao: funcionario.dataAdmissao,
      cargo: funcionario.cargo,
      setor: funcionario.setor,
      empresa: funcionario.empresa,
      empresa_id: funcionario.empresaId,
      status: funcionario.status,
      observacoes: funcionario.observacoes,
      email: funcionario.email,
      telefone: funcionario.telefone,
    })
    .select(`
      *,
      empresa:app_b4d7b_empresas(nome)
    `)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nome: data.nome,
    cpf: data.cpf,
    rg: data.rg,
    dataNascimento: data.data_nascimento,
    dataAdmissao: data.data_admissao,
    cargo: data.cargo,
    setor: data.setor,
    empresa: data.empresa,
    empresaId: data.empresa_id,
    empresaNome: data.empresa?.nome,
    status: data.status,
    observacoes: data.observacoes,
    email: data.email,
    telefone: data.telefone,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateFuncionario(
  id: string,
  dados: Partial<Funcionario>
): Promise<Funcionario | null> {
  const updateData: Record<string, string | undefined> = {};
  
  if (dados.nome !== undefined) updateData.nome = dados.nome;
  if (dados.cpf !== undefined) updateData.cpf = dados.cpf;
  if (dados.rg !== undefined) updateData.rg = dados.rg;
  if (dados.dataNascimento !== undefined) updateData.data_nascimento = dados.dataNascimento;
  if (dados.dataAdmissao !== undefined) updateData.data_admissao = dados.dataAdmissao;
  if (dados.cargo !== undefined) updateData.cargo = dados.cargo;
  if (dados.setor !== undefined) updateData.setor = dados.setor;
  if (dados.empresa !== undefined) updateData.empresa = dados.empresa;
  if (dados.empresaId !== undefined) updateData.empresa_id = dados.empresaId;
  if (dados.status !== undefined) updateData.status = dados.status;
  if (dados.observacoes !== undefined) updateData.observacoes = dados.observacoes;
  if (dados.email !== undefined) updateData.email = dados.email;
  if (dados.telefone !== undefined) updateData.telefone = dados.telefone;

  const { data, error } = await supabase
    .from('app_b4d7b_funcionarios')
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
    nome: data.nome,
    cpf: data.cpf,
    rg: data.rg,
    dataNascimento: data.data_nascimento,
    dataAdmissao: data.data_admissao,
    cargo: data.cargo,
    setor: data.setor,
    empresa: data.empresa,
    empresaId: data.empresa_id,
    empresaNome: data.empresa?.nome,
    status: data.status,
    observacoes: data.observacoes,
    email: data.email,
    telefone: data.telefone,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteFuncionario(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('app_b4d7b_funcionarios')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export function saveFuncionarios(): void {
  // Não usado mais - dados salvos automaticamente no Supabase
  console.warn('saveFuncionarios não é mais necessário com Supabase');
}

// ========== CERTIFICADOS ==========
export async function getCertificados(): Promise<Certificado[]> {
  const { data, error } = await supabase
    .from('app_b4d7b_certificados')
    .select(`
      *,
      funcionario:app_b4d7b_funcionarios(nome)
    `)
    .order('data_validade');

  if (error) throw error;

  return (data || []).map(c => ({
    id: c.id,
    funcionarioId: c.funcionario_id,
    funcionarioNome: c.funcionario?.nome,
    tipo: c.tipo,
    numero: c.numero,
    dataEmissao: c.data_emissao,
    dataValidade: c.data_validade,
    orgaoEmissor: c.orgao_emissor,
    status: c.status,
    arquivoUrl: c.arquivo_url,
    arquivoNome: c.arquivo_nome,
    observacoes: c.observacoes,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }));
}

export async function getCertificadosByFuncionario(funcionarioId: string): Promise<Certificado[]> {
  const { data, error } = await supabase
    .from('app_b4d7b_certificados')
    .select(`
      *,
      funcionario:app_b4d7b_funcionarios(nome)
    `)
    .eq('funcionario_id', funcionarioId)
    .order('data_validade');

  if (error) throw error;

  return (data || []).map(c => ({
    id: c.id,
    funcionarioId: c.funcionario_id,
    funcionarioNome: c.funcionario?.nome,
    tipo: c.tipo,
    numero: c.numero,
    dataEmissao: c.data_emissao,
    dataValidade: c.data_validade,
    orgaoEmissor: c.orgao_emissor,
    status: c.status,
    arquivoUrl: c.arquivo_url,
    arquivoNome: c.arquivo_nome,
    observacoes: c.observacoes,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }));
}

export async function getCertificadoById(id: string): Promise<Certificado | undefined> {
  const { data, error } = await supabase
    .from('app_b4d7b_certificados')
    .select(`
      *,
      funcionario:app_b4d7b_funcionarios(nome)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return undefined;

  return {
    id: data.id,
    funcionarioId: data.funcionario_id,
    funcionarioNome: data.funcionario?.nome,
    tipo: data.tipo,
    numero: data.numero,
    dataEmissao: data.data_emissao,
    dataValidade: data.data_validade,
    orgaoEmissor: data.orgao_emissor,
    status: data.status,
    arquivoUrl: data.arquivo_url,
    arquivoNome: data.arquivo_nome,
    observacoes: data.observacoes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function addCertificado(
  certificado: Omit<Certificado, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Certificado> {
  const { data, error } = await supabase
    .from('app_b4d7b_certificados')
    .insert({
      funcionario_id: certificado.funcionarioId,
      tipo: certificado.tipo,
      numero: certificado.numero,
      data_emissao: certificado.dataEmissao,
      data_validade: certificado.dataValidade,
      orgao_emissor: certificado.orgaoEmissor,
      status: certificado.status,
      arquivo_url: certificado.arquivoUrl,
      arquivo_nome: certificado.arquivoNome,
      observacoes: certificado.observacoes,
    })
    .select(`
      *,
      funcionario:app_b4d7b_funcionarios(nome)
    `)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    funcionarioId: data.funcionario_id,
    funcionarioNome: data.funcionario?.nome,
    tipo: data.tipo,
    numero: data.numero,
    dataEmissao: data.data_emissao,
    dataValidade: data.data_validade,
    orgaoEmissor: data.orgao_emissor,
    status: data.status,
    arquivoUrl: data.arquivo_url,
    arquivoNome: data.arquivo_nome,
    observacoes: data.observacoes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateCertificado(
  id: string,
  dados: Partial<Certificado>
): Promise<Certificado | null> {
  const updateData: Record<string, string | undefined> = {};
  
  if (dados.tipo !== undefined) updateData.tipo = dados.tipo;
  if (dados.numero !== undefined) updateData.numero = dados.numero;
  if (dados.dataEmissao !== undefined) updateData.data_emissao = dados.dataEmissao;
  if (dados.dataValidade !== undefined) updateData.data_validade = dados.dataValidade;
  if (dados.orgaoEmissor !== undefined) updateData.orgao_emissor = dados.orgaoEmissor;
  if (dados.status !== undefined) updateData.status = dados.status;
  if (dados.arquivoUrl !== undefined) updateData.arquivo_url = dados.arquivoUrl;
  if (dados.arquivoNome !== undefined) updateData.arquivo_nome = dados.arquivoNome;
  if (dados.observacoes !== undefined) updateData.observacoes = dados.observacoes;

  const { data, error } = await supabase
    .from('app_b4d7b_certificados')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      funcionario:app_b4d7b_funcionarios(nome)
    `)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    funcionarioId: data.funcionario_id,
    funcionarioNome: data.funcionario?.nome,
    tipo: data.tipo,
    numero: data.numero,
    dataEmissao: data.data_emissao,
    dataValidade: data.data_validade,
    orgaoEmissor: data.orgao_emissor,
    status: data.status,
    arquivoUrl: data.arquivo_url,
    arquivoNome: data.arquivo_nome,
    observacoes: data.observacoes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteCertificado(id: string): Promise<boolean> {
  // Primeiro, obter o certificado para deletar o arquivo se existir
  const cert = await getCertificadoById(id);
  
  if (cert?.arquivoUrl) {
    // Extrair o path do arquivo da URL
    const urlParts = cert.arquivoUrl.split('/certificados/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await deleteFile('certificados', filePath);
    }
  }

  const { error } = await supabase
    .from('app_b4d7b_certificados')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export function saveCertificados(): void {
  // Não usado mais - dados salvos automaticamente no Supabase
  console.warn('saveCertificados não é mais necessário com Supabase');
}

// ========== DASHBOARD STATS ==========
export async function getDashboardStats(): Promise<DashboardStats> {
  const funcionarios = await getFuncionarios();
  const certificados = await getCertificados();
  
  const hoje = new Date();
  const em30Dias = new Date();
  em30Dias.setDate(hoje.getDate() + 30);

  const totalFuncionarios = funcionarios.length;
  const funcionariosAtivos = funcionarios.filter(f => f.status === 'ativo').length;
  const totalCertificados = certificados.length;

  const certificadosValidos = certificados.filter(
    c => new Date(c.dataValidade) >= hoje
  ).length;

  const certificadosVencendo = certificados.filter(c => {
    const dataValidade = new Date(c.dataValidade);
    return dataValidade >= hoje && dataValidade <= em30Dias;
  }).length;

  const certificadosVencidos = certificados.filter(
    c => new Date(c.dataValidade) < hoje
  ).length;

  const funcionariosRecentes = funcionarios
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const certificadosVencendoLista = certificados
    .filter(c => {
      const dataValidade = new Date(c.dataValidade);
      return dataValidade >= hoje && dataValidade <= em30Dias;
    })
    .map(c => ({
      ...c,
      diasRestantes: Math.ceil(
        (new Date(c.dataValidade).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 5);

  const certificadosVencidosLista = certificados
    .filter(c => new Date(c.dataValidade) < hoje)
    .map(c => ({
      ...c,
      diasVencido: Math.ceil(
        (hoje.getTime() - new Date(c.dataValidade).getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => b.diasVencido - a.diasVencido)
    .slice(0, 5);

  return {
    totalFuncionarios,
    funcionariosAtivos,
    totalCertificados,
    certificadosValidos,
    certificadosVencendo,
    certificadosVencidos,
    funcionariosRecentes,
    certificadosVencendoLista,
    certificadosVencidosLista,
  };
}

// Função de compatibilidade
export function initializeDefaultData() {
  // Não faz nada - dados já estão no Supabase
}

// Exportar funções de upload
export { uploadFile, deleteFile, getPublicUrl };