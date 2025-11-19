# 🔌 Como Conectar DBeaver ao Neon

## 📋 Onde Encontrar a Senha

A senha do Neon está na **Connection String** que você recebeu ao criar o projeto.

### Passo 1: Acessar Connection String no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Faça login na sua conta
3. Selecione seu projeto
4. Na página do projeto, procure por **"Connection Details"** ou **"Connection String"**
5. Você verá algo assim:

```
postgresql://usuario:SUA_SENHA_AQUI@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### Passo 2: Extrair a Senha

A senha está entre `:` e `@` na Connection String:

```
postgresql://usuario:SENHA_AQUI@ep-xxx-xxx...
              ↑        ↑
           usuário   SENHA (é isso que você precisa!)
```

**Exemplo:**
- Connection String: `postgresql://user:abc123xyz@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require`
- **Senha:** `abc123xyz`

### ⚠️ IMPORTANTE

- Se você **não anotou a senha** quando criou o projeto, você precisa **resetá-la**
- No painel do Neon, vá em **Settings** → **Reset Password**
- Uma nova senha será gerada (anote ela!)

---

## 🔧 Configurar DBeaver

### Opção 1: Usando Connection String Completa (Mais Fácil)

1. Abra o DBeaver
2. Clique em **"New Database Connection"** (ícone de plug)
3. Selecione **PostgreSQL**
4. Clique em **"Next"**
5. Na aba **"Main"**, cole a **Connection String completa** no campo **"URL"**:
   ```
   postgresql://usuario:senha@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
6. O DBeaver vai extrair automaticamente:
   - Host
   - Port
   - Database
   - Username
   - Password
7. Clique em **"Test Connection"**
8. Se funcionar, clique em **"Finish"**

### Opção 2: Preencher Campos Manualmente

1. Abra o DBeaver
2. Clique em **"New Database Connection"**
3. Selecione **PostgreSQL**
4. Clique em **"Next"**

5. Preencha os campos:

   **Main:**
   - **Host:** `ep-xxx-xxx.region.aws.neon.tech` (extraia da Connection String)
   - **Port:** `5432` (padrão PostgreSQL)
   - **Database:** Nome do banco (geralmente `neondb` ou o nome do seu projeto)
   - **Username:** Nome do usuário (antes do `:` na Connection String)
   - **Password:** **A SENHA** (entre `:` e `@` na Connection String)

   **SSL:**
   - Marque **"Use SSL"**
   - SSL Mode: **"require"**

6. Clique em **"Test Connection"**
7. Se aparecer "Connected", clique em **"Finish"**

---

## 📝 Exemplo Prático

Sua Connection String do Neon:
```
postgresql://neondb_owner:AbC123XyZ@ep-cool-dream-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**No DBeaver, você preencheria:**

| Campo | Valor |
|-------|-------|
| **Host** | `ep-cool-dream-123456.us-east-2.aws.neon.tech` |
| **Port** | `5432` |
| **Database** | `neondb` |
| **Username** | `neondb_owner` |
| **Password** | `AbC123XyZ` |
| **SSL** | ✅ Marcado |
| **SSL Mode** | `require` |

---

## 🐛 Problemas Comuns

### Erro: "password authentication failed"

**Solução:**
1. Verifique se copiou a senha corretamente (sem espaços)
2. A senha pode ter caracteres especiais - copie exatamente
3. Se não lembra a senha, resete no painel do Neon

### Erro: "connection refused" ou "timeout"

**Solução:**
1. Verifique se o projeto Neon está ativo
2. Confirme que copiou o host correto
3. Verifique sua conexão com internet
4. Tente usar `sslmode=require` nas configurações SSL

### Erro: "database does not exist"

**Solução:**
1. O nome do banco geralmente é `neondb` ou o nome do seu projeto
2. Verifique na Connection String qual é o nome correto
3. No Neon, você pode ver o nome do banco em **Settings** → **Databases**

### DBeaver não conecta mesmo com dados corretos

**Solução:**
1. Certifique-se de que marcou **"Use SSL"**
2. SSL Mode deve ser **"require"**
3. Tente usar a Connection String completa no campo URL
4. Atualize o driver PostgreSQL no DBeaver:
   - Clique com botão direito na conexão
   - **Edit Connection** → **Drivers** → **Download/Update**

---

## ✅ Checklist

- [ ] Connection String copiada do Neon
- [ ] Senha extraída corretamente (entre `:` e `@`)
- [ ] DBeaver configurado com:
  - [ ] Host correto
  - [ ] Port 5432
  - [ ] Database correto
  - [ ] Username correto
  - [ ] **Password correto** ⭐
  - [ ] SSL habilitado
  - [ ] SSL Mode = require
- [ ] Test Connection funcionou
- [ ] Conexão salva e funcionando

---

## 💡 Dica Extra

Se você está usando o arquivo `.env` no backend, a senha está lá também:

```env
DATABASE_URL=postgresql://usuario:SENHA_AQUI@host/database
```

A senha é a mesma que você usa no DBeaver!

---

**Última atualização:** 2025-01-27

