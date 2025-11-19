# ✅ Verificar Conexão com Base de Dados

## 🔍 Status Atual

### ✅ O que JÁ está configurado:

1. **Backend (app.py)**
   - ✅ Código de conexão implementado
   - ✅ Pool de conexões configurado
   - ✅ Endpoints da API prontos
   - ✅ Tratamento de erros

2. **Frontend**
   - ✅ JavaScript configurado para fazer requisições
   - ✅ URL da API configurada (`http://localhost:5000`)
   - ✅ Fallback para modo desenvolvimento

### ⚠️ O que PRECISA ser feito:

1. **Arquivo `.env`** - Criar e configurar
2. **Base de dados no Neon** - Criar tabelas
3. **Backend rodando** - Iniciar servidor Flask

---

## 🧪 Como Verificar se Está Conectado

### Teste 1: Verificar Arquivo .env

```bash
cd backend
# Verificar se existe
dir .env  # Windows
# ou
ls .env   # Linux/Mac
```

**Se não existir:**
1. Copie `env.example` para `.env`
2. Configure a `DATABASE_URL` do Neon

### Teste 2: Verificar Conexão do Backend

1. **Inicie o backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Procure por estas mensagens:**
   - ✅ **"Pool de conexões criado com sucesso"** = Conectado!
   - ❌ **"Erro ao criar pool de conexões"** = Problema na conexão

3. **Teste o endpoint:**
   - Abra no navegador: http://localhost:5000/api/health
   - Deve retornar: `{"status": "ok", "message": "API está funcionando"}`

### Teste 3: Testar Formulário do Site

1. Abra o site: `public/index.html`
2. Preencha o formulário de orçamento
3. Clique em "Enviar"

**Resultados possíveis:**

- ✅ **"Orçamento enviado com sucesso!"** = Conectado e funcionando!
- ⚠️ **"Orçamento enviado com sucesso! (Modo desenvolvimento)"** = Backend não está rodando
- ❌ **Erro no console** = Verifique a URL da API

### Teste 4: Verificar no Console do Navegador

1. Abra o site
2. Pressione `F12` (DevTools)
3. Vá na aba **Console**
4. Envie um formulário
5. Veja as mensagens:

**Se conectado:**
```
POST http://localhost:5000/api/orcamento 200 OK
```

**Se não conectado:**
```
Backend não disponível, usando modo de desenvolvimento
POST http://localhost:5000/api/orcamento net::ERR_CONNECTION_REFUSED
```

---

## 🔧 Checklist de Conexão

Marque o que já está feito:

### Configuração Inicial
- [ ] Conta no Neon criada
- [ ] Projeto no Neon criado
- [ ] Base de dados criada (tabelas)
- [ ] Connection String copiada do Neon

### Backend
- [ ] Arquivo `backend/.env` criado
- [ ] `DATABASE_URL` configurada no `.env`
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Backend inicia sem erros
- [ ] Mensagem "Pool de conexões criado com sucesso" aparece
- [ ] Endpoint `/api/health` responde

### Frontend
- [ ] Site abre no navegador
- [ ] Formulário funciona
- [ ] Requisições chegam ao backend
- [ ] Dados são salvos no banco

---

## 🚨 Problemas Comuns

### "Backend não disponível, usando modo de desenvolvimento"

**Causa:** Backend não está rodando

**Solução:**
1. Abra um terminal
2. `cd backend`
3. `python app.py`
4. Deixe o terminal aberto (servidor rodando)

### "Erro ao criar pool de conexões"

**Causa:** `DATABASE_URL` incorreta ou banco não existe

**Solução:**
1. Verifique o arquivo `backend/.env`
2. Confirme que `DATABASE_URL` está correta
3. Teste a conexão no DBeaver
4. Execute o script SQL no Neon

### "CORS error" no console

**Causa:** Backend não permite requisições do frontend

**Solução:**
- Já está configurado (`CORS(app)` no app.py)
- Se persistir, verifique se o backend está rodando na porta 5000

### Formulário não envia

**Causa:** JavaScript não carregou ou erro no código

**Solução:**
1. Abra o Console (F12)
2. Veja se há erros
3. Verifique se `main.js` está carregando

---

## ✅ Teste Completo

Execute este teste passo a passo:

### 1. Backend
```bash
cd backend
python app.py
```
**Esperado:** "Pool de conexões criado com sucesso"

### 2. Teste API
Abra: http://localhost:5000/api/health
**Esperado:** `{"status": "ok", "message": "API está funcionando"}`

### 3. Teste Formulário
1. Abra `public/index.html`
2. Preencha e envie o formulário
3. **Esperado:** "Orçamento enviado com sucesso!"

### 4. Verificar no Banco
No DBeaver ou SQL Editor do Neon:
```sql
SELECT * FROM orcamentos ORDER BY criado_em DESC LIMIT 1;
```
**Esperado:** Seu orçamento aparece na lista

---

## 📊 Status da Conexão

### 🟢 Totalmente Conectado
- Backend rodando ✅
- Banco de dados conectado ✅
- Formulário salva no banco ✅
- Dados aparecem no DBeaver ✅

### 🟡 Parcialmente Conectado
- Backend rodando ✅
- Banco conectado ✅
- Formulário funciona ⚠️ (mas não salva)
- **Ação:** Verificar se tabelas foram criadas

### 🔴 Não Conectado
- Backend não roda ❌
- Ou banco não conecta ❌
- **Ação:** Seguir checklist acima

---

**Última atualização:** 2025-01-27

