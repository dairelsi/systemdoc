# Guia de Implantação - Sistema de Controle de Documentação

## ✅ Configuração Concluída

### 1. Banco de Dados Supabase
- ✅ Tabelas criadas (empresas, usuários, funcionários, certificados, tipos de certificado)
- ✅ Políticas RLS configuradas
- ✅ Índices otimizados
- ✅ Storage bucket para certificados

### 2. Arquivos Backend
- ✅ `.env` - Variáveis de ambiente
- ✅ `src/lib/supabase.ts` - Cliente Supabase
- ✅ `src/lib/auth.ts` - Sistema de autenticação
- ✅ `src/lib/storage.ts` - Operações de dados
- ✅ `database-setup.sql` - Script SQL completo

### 3. Edge Function
- ✅ `supabase/functions/create-user/index.ts` - Criação de usuários

## 📋 Próximos Passos para Deploy

### Passo 1: Deploy da Edge Function no Supabase

1. **Instalar Supabase CLI:**
```bash
npm install -g supabase
```

2. **Login no Supabase:**
```bash
supabase login
```

3. **Link com seu projeto:**
```bash
supabase link --project-ref kcqcbrkmpbdsosmmrgqn
```

4. **Deploy da função:**
```bash
supabase functions deploy create-user
```

### Passo 2: Criar Primeiro Usuário Administrador

Execute no SQL Editor do Supabase:

```sql
-- 1. Primeiro, crie o usuário no Authentication
-- Vá em Authentication → Users → Add User
-- Email: admin@unicofacilities.com.br
-- Password: (sua senha segura)
-- Anote o UUID gerado

-- 2. Depois, crie o perfil (substitua o UUID):
INSERT INTO app_b4d7b_usuarios (id, nome, email, nivel_acesso, ativo)
VALUES ('UUID_DO_USUARIO', 'Administrador', 'admin@unicofacilities.com.br', 'administrador', true);
```

### Passo 3: Build e Deploy do Frontend

1. **Build do projeto:**
```bash
cd /workspace/shadcn-ui
pnpm run build
```

2. **Deploy para controle.unicofacilities.com.br:**

Opções de deploy:

**Opção A: Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

**Opção B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Opção C: Servidor próprio**
- Faça upload da pasta `dist/` para seu servidor
- Configure o servidor web (Nginx/Apache) para servir os arquivos
- Configure o domínio controle.unicofacilities.com.br

### Passo 4: Configurar Domínio

1. Configure o DNS do domínio `controle.unicofacilities.com.br`
2. Aponte para o servidor/serviço de hospedagem
3. Configure SSL/HTTPS (Let's Encrypt recomendado)

### Passo 5: Configurar Email (Recuperação de Senha)

No Supabase Dashboard:
1. Vá em Authentication → Email Templates
2. Configure o template de "Reset Password"
3. Configure SMTP em Settings → Auth → SMTP Settings

## 🔒 Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas:

```env
VITE_SUPABASE_URL=https://kcqcbrkmpbdsosmmrgqn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testar o Sistema

1. **Login:**
   - Acesse controle.unicofacilities.com.br
   - Faça login com o usuário administrador

2. **Criar Empresa:**
   - Vá em Configurações (se houver) ou use SQL:
   ```sql
   INSERT INTO app_b4d7b_empresas (nome) VALUES ('Unico Facilities');
   ```

3. **Criar Funcionário:**
   - Teste criar um novo funcionário
   - Verifique se aparece no dashboard

4. **Upload de Certificado:**
   - Adicione um certificado a um funcionário
   - Faça upload de um arquivo PDF
   - Verifique se o arquivo foi salvo no Storage

5. **Relatórios:**
   - Teste gerar relatórios
   - Verifique exportação CSV/PDF

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se a edge function tem os headers CORS corretos
- Adicione o domínio nas configurações do Supabase

### Erro de Autenticação
- Verifique se as credenciais do `.env` estão corretas
- Confirme que o usuário tem perfil na tabela `app_b4d7b_usuarios`

### Erro de Upload
- Verifique as políticas RLS do storage bucket
- Confirme que o bucket `certificados` existe e é público

### Erro de Permissões
- Verifique as políticas RLS das tabelas
- Confirme o `nivel_acesso` do usuário

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs no Supabase Dashboard
2. Verifique o console do navegador (F12)
3. Verifique os logs da edge function

## 🎉 Sistema Pronto!

Após seguir todos os passos, seu sistema estará:
- ✅ Rodando em produção
- ✅ Com banco de dados seguro
- ✅ Com autenticação funcional
- ✅ Com upload de arquivos
- ✅ Com recuperação de senha
- ✅ Pronto para uso em controle.unicofacilities.com.br