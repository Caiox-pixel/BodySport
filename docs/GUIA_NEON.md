# 🗄️ Guia Completo: Criar Base de Dados no Neon

## 📋 Pré-requisitos

- Conta no [Neon](https://neon.tech) (gratuita)
- Navegador web

---

## 🚀 Passo a Passo

### 1. Criar Conta/Projeto no Neon

1. Acesse [https://neon.tech](https://neon.tech)
2. Clique em **"Sign Up"** ou **"Get Started"**
3. Faça login com GitHub, Google ou email
4. Clique em **"Create a project"**
5. Escolha um nome para o projeto (ex: `bodysport`)
6. Selecione a região mais próxima (ex: `São Paulo` ou `US East`)
7. Escolha a versão do PostgreSQL (recomendado: **15** ou **16**)
8. Clique em **"Create project"**

### 2. Obter String de Conexão

Após criar o projeto:

1. Na página do projeto, você verá a seção **"Connection Details"**
2. Copie a **Connection String** (ela se parece com):
   ```
   postgresql://usuario:senha@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. **IMPORTANTE**: Anote a senha que aparece, você precisará dela!

### 3. Configurar Variáveis de Ambiente

1. No seu projeto, copie o arquivo `backend/env.example` para `backend/.env`:
   ```bash
   cd backend
   copy env.example .env  # Windows
   # ou
   cp env.example .env    # Linux/Mac
   ```

2. Abra o arquivo `backend/.env` e cole a Connection String:
   ```env
   DATABASE_URL=postgresql://usuario:senha@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   FLASK_ENV=development
   FLASK_DEBUG=True
   FLASK_APP=app.py
   JWT_SECRET_KEY=sua-chave-secreta-aqui
   API_URL=http://localhost:5000
   PORT=5000
   ```

3. **Substitua** `sua-chave-secreta-aqui` por uma chave aleatória segura (pode gerar em: https://randomkeygen.com/)

### 4. Executar Script SQL no Neon

Você tem **3 opções** para executar o script:

#### **Opção A: Via Interface Web do Neon (Mais Fácil)**

1. No painel do Neon, clique em **"SQL Editor"** (no menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `backend/database_setup.sql` no seu editor
4. Copie **TODO o conteúdo** do arquivo
5. Cole no editor SQL do Neon
6. Clique em **"Run"** ou pressione `Ctrl+Enter`
7. Aguarde a mensagem de sucesso

#### **Opção B: Via psql (Linha de Comando)**

1. Instale o PostgreSQL client (se não tiver):
   - Windows: Baixe do [site oficial](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql-client`

2. Execute o comando:
   ```bash
   psql "sua-connection-string-aqui" -f backend/database_setup.sql
   ```

#### **Opção C: Via Python Script (Automático)**

Crie um arquivo `backend/setup_database.py`:

```python
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def setup_database():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    
    with open('database_setup.sql', 'r', encoding='utf-8') as f:
        sql = f.read()
        cur.execute(sql)
    
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Base de dados criada com sucesso!")

if __name__ == "__main__":
    setup_database()
```

Execute:
```bash
cd backend
python setup_database.py
```

### 5. Verificar se Funcionou

No SQL Editor do Neon, execute:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Deve retornar:
-- usuarios
-- orcamentos
-- modelos_3d
-- bodykits
```

### 6. Testar Conexão do Backend

1. Certifique-se de que o arquivo `.env` está configurado
2. Instale as dependências (se ainda não fez):
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Execute o backend:
   ```bash
   python app.py
   ```

4. Você deve ver a mensagem:
   ```
   Pool de conexões criado com sucesso
   * Running on http://127.0.0.1:5000
   ```

5. Teste o endpoint de health:
   - Abra: http://localhost:5000/api/health
   - Deve retornar: `{"status": "ok", "message": "API está funcionando"}`

---

## 🔐 Segurança

### ⚠️ IMPORTANTE: Nunca commite o arquivo `.env`!

O arquivo `.env` contém credenciais sensíveis. Certifique-se de que está no `.gitignore`:

```bash
# backend/.gitignore
.env
__pycache__/
*.pyc
```

### Criar Usuário de Teste

Para testar o sistema de login, você precisa criar um usuário com senha hash:

```python
# backend/create_user.py
import bcrypt
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def create_user(email, senha_plana, nome):
    # Hash da senha
    senha_hash = bcrypt.hashpw(senha_plana.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Conectar ao banco
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    
    # Inserir usuário
    cur.execute(
        "INSERT INTO usuarios (email, senha, nome) VALUES (%s, %s, %s)",
        (email, senha_hash, nome)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ Usuário {email} criado com sucesso!")

if __name__ == "__main__":
    create_user("admin@bodysport.com", "senha123", "Administrador")
```

Execute:
```bash
python backend/create_user.py
```

---

## 📊 Estrutura das Tabelas

### `usuarios`
- Armazena usuários do sistema
- Senhas em hash bcrypt
- Email único

### `orcamentos`
- Solicitações de orçamento
- Inclui dados do projeto (JSON)
- Status: pendente, aprovado, rejeitado

### `modelos_3d` (Futuro)
- Modelos 3D para visualização
- Preparado para integração futura

### `bodykits` (Futuro)
- Bodykits disponíveis
- Relacionado com modelos 3D

---

## 🐛 Troubleshooting

### Erro: "connection refused"
- Verifique se a Connection String está correta
- Confirme que o projeto Neon está ativo
- Verifique se o IP está permitido (Neon permite todos por padrão)

### Erro: "relation does not exist"
- Execute o script SQL novamente
- Verifique se está conectado ao banco correto

### Erro: "password authentication failed"
- Verifique a senha na Connection String
- Se necessário, redefina a senha no painel do Neon

### Erro: "module 'psycopg2' not found"
- Instale: `pip install psycopg2-binary`

---

## ✅ Checklist Final

- [ ] Conta criada no Neon
- [ ] Projeto criado no Neon
- [ ] Connection String copiada
- [ ] Arquivo `.env` criado e configurado
- [ ] Script SQL executado com sucesso
- [ ] Tabelas verificadas no SQL Editor
- [ ] Backend conecta sem erros
- [ ] Endpoint `/api/health` responde
- [ ] Usuário de teste criado (opcional)

---

## 📚 Recursos Úteis

- [Documentação Neon](https://neon.tech/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [psycopg2 Docs](https://www.psycopg.org/docs/)

---

**Última atualização:** 2025-01-27

