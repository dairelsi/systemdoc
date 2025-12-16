# MÉTODO DEFINITIVO - Criar Usuário via Dashboard do Supabase

O problema é que a senha criptografada via SQL não está sendo aceita pelo Supabase Auth.

## ✅ SOLUÇÃO GARANTIDA - Use o Dashboard do Supabase

### PASSO 1: Deletar o usuário atual

Execute este SQL no Supabase SQL Editor:
```sql
BEGIN;
DELETE FROM app_b4d7b_usuarios WHERE email = 'dairel.bomfim@unicogroup.com.br';
DELETE FROM auth.users WHERE email = 'dairel.bomfim@unicogroup.com.br';
COMMIT;
```

### PASSO 2: Criar usuário via Dashboard (MÉTODO GARANTIDO)

1. **Acesse a página de usuários:**
   https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/auth/users

2. **Clique no botão verde "Add user"** (canto superior direito)

3. **Selecione "Create new user"**

4. **Preencha:**
   - Email: `dairel.bomfim@unicogroup.com.br`
   - Password: `$Log-000-`
   - **✅ MARQUE "Auto Confirm User"** (MUITO IMPORTANTE!)

5. **Clique em "Create user"**

6. **Copie o UUID** do usuário criado (aparece na lista)

### PASSO 3: Inserir na tabela app_b4d7b_usuarios

Execute este SQL substituindo `SEU_UUID_AQUI` pelo UUID copiado:

```sql
INSERT INTO app_b4d7b_usuarios (
  id,
  email,
  nome,
  nivel_acesso,
  ativo,
  created_at,
  updated_at
) VALUES (
  'SEU_UUID_AQUI',
  'dairel.bomfim@unicogroup.com.br',
  'Dairel Bomfim',
  'administrador',
  true,
  NOW(),
  NOW()
);
```

### PASSO 4: Testar o login

Agora faça login com:
- Email: `dairel.bomfim@unicogroup.com.br`
- Senha: `$Log-000-`

---

## 🔍 POR QUE O SQL NÃO FUNCIONA?

O Supabase usa um algoritmo específico de criptografia (bcrypt) que precisa ser executado pela API Admin oficial. Quando criamos via SQL direto, a senha não é criptografada da forma que o Supabase Auth espera.

O Dashboard usa a API Admin correta, garantindo que a senha funcione.

---

## ⚠️ ALTERNATIVA: Edge Function

Se você não conseguir acessar o Dashboard, posso criar uma Edge Function que usa a API Admin para criar o usuário. Mas o método do Dashboard é mais rápido e garantido.