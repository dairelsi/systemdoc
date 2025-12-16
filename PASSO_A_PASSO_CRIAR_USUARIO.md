# 🎯 GUIA DEFINITIVO - CRIAR USUÁRIO ADMIN

## ⚠️ ATENÇÃO: Siga EXATAMENTE esta ordem!

---

## 📍 PASSO 1: Criar Usuário no Supabase Authentication

### 1.1. Abra este link no seu navegador:
```
https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/auth/users
```

### 1.2. Faça login no Supabase (se necessário)

### 1.3. Procure o botão verde "Add user" no canto superior direito
- Se não encontrar, procure por "Create user" ou "New user"

### 1.4. Clique em "Add user" → "Create new user"

### 1.5. Preencha os campos:
```
Email: dairel.bomfim@unicogroup.com.br
Password: $Log-000-
```

### 1.6. ⚠️ MUITO IMPORTANTE - Procure e MARQUE esta opção:
```
☑️ Auto Confirm User
```
**OU**
```
☑️ Confirm email
```
**OU**
```
☑️ Email confirmed
```

> **DICA:** Esta opção pode estar escondida. Role a tela para baixo se não encontrar.

### 1.7. Clique em "Create user" ou "Save"

### 1.8. Após criar, você verá o usuário na lista
- Procure a linha com o email `dairel.bomfim@unicogroup.com.br`
- Na primeira coluna, você verá um código longo (UUID)
- Exemplo: `0fc60033-ed15-4f43-94f4-f7e93d60ca96`

### 1.9. **COPIE ESTE UUID** (clique para selecionar e Ctrl+C)

---

## 📍 PASSO 2: Inserir Usuário na Tabela

### 2.1. Abra este link no seu navegador:
```
https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/sql/new
```

### 2.2. Cole este SQL (SUBSTITUA `SEU_UUID_AQUI` pelo UUID que você copiou):

```sql
INSERT INTO app_b4d7b_usuarios (id, nome, email, nivel_acesso, ativo)
VALUES ('SEU_UUID_AQUI', 'Dairel Bomfim', 'dairel.bomfim@unicogroup.com.br', 'administrador', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  nivel_acesso = EXCLUDED.nivel_acesso,
  ativo = EXCLUDED.ativo,
  updated_at = timezone('utc'::text, now());
```

### 2.3. Exemplo com UUID fictício (NÃO USE ESTE, use o seu!):
```sql
INSERT INTO app_b4d7b_usuarios (id, nome, email, nivel_acesso, ativo)
VALUES ('0fc60033-ed15-4f43-94f4-f7e93d60ca96', 'Dairel Bomfim', 'dairel.bomfim@unicogroup.com.br', 'administrador', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  nivel_acesso = EXCLUDED.nivel_acesso,
  ativo = EXCLUDED.ativo,
  updated_at = timezone('utc'::text, now());
```

### 2.4. Clique em "Run" (ou pressione Ctrl+Enter)

### 2.5. Você deve ver:
```
Success. 1 row affected.
```
**OU**
```
Success. No rows returned.
```

Ambos significam que funcionou! ✅

---

## 📍 PASSO 3: Testar o Login

### 3.1. Volte para a aplicação (App Viewer)

### 3.2. Use estas credenciais:
```
Email: dairel.bomfim@unicogroup.com.br
Senha: $Log-000-
```

### 3.3. Clique em "Entrar"

### 3.4. Se funcionar: 🎉 SUCESSO!

### 3.5. Se NÃO funcionar:
- Volte para o PASSO 1.6 e verifique se marcou "Auto Confirm User"
- Se não marcou, delete o usuário e crie novamente

---

## 🔍 VERIFICAÇÕES

### Como verificar se o usuário foi criado no Authentication:
1. Acesse: https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/auth/users
2. Procure por `dairel.bomfim@unicogroup.com.br` na lista
3. Verifique se a coluna "Email Confirmed" está com ✅

### Como verificar se o usuário está na tabela:
1. Acesse: https://supabase.com/dashboard/project/kcqcbrkmpbdsosmmrgqn/editor
2. Clique na tabela `app_b4d7b_usuarios`
3. Você deve ver uma linha com o email `dairel.bomfim@unicogroup.com.br`

---

## ❌ ERROS COMUNS

### Erro: "Invalid login credentials"
**Causa:** Usuário não existe no Authentication OU senha errada OU email não confirmado
**Solução:** Volte ao PASSO 1 e crie o usuário novamente, marcando "Auto Confirm User"

### Erro: "duplicate key value violates unique constraint"
**Causa:** Você está tentando inserir um UUID que já existe
**Solução:** Use o SQL com `ON CONFLICT` que forneci no PASSO 2.2

### Erro: "User not found in database"
**Causa:** Usuário existe no Authentication mas não na tabela
**Solução:** Execute o SQL do PASSO 2

---

## 📞 AINDA NÃO FUNCIONOU?

Se você seguiu TODOS os passos e ainda não funciona:

1. **Tire um print da tela** do Supabase Authentication mostrando o usuário criado
2. **Tire um print da tela** do Supabase Table Editor mostrando a tabela app_b4d7b_usuarios
3. **Tire um print da tela** do erro que aparece no login
4. **Me envie os 3 prints** para eu ver exatamente o que está acontecendo

---

## ✅ CHECKLIST FINAL

Antes de testar o login, confirme:

- [ ] Criei o usuário no Authentication (PASSO 1)
- [ ] Marquei "Auto Confirm User" (PASSO 1.6)
- [ ] Copiei o UUID correto (PASSO 1.9)
- [ ] Executei o SQL INSERT com o UUID correto (PASSO 2)
- [ ] Vi "Success" após executar o SQL (PASSO 2.5)
- [ ] Estou usando a senha correta: `$Log-000-` (PASSO 3.2)

Se todos os itens estão marcados, o login DEVE funcionar! 🚀