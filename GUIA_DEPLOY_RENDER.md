# 🚀 Guia Rápido: Hospedar no Render

## 📋 Passo a Passo Simplificado

### 1️⃣ Preparar o Repositório Git

Se ainda não tem Git inicializado:

```bash
git init
git add .
git commit -m "Preparar para deploy no Render"
```

**Importante:** Se você usa GitHub/GitLab, faça push do código primeiro.

---

### 2️⃣ Deploy do Backend (API)

#### A. Criar Serviço no Render

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório (GitHub/GitLab/Bitbucket) ou faça deploy manual

#### B. Configurações do Serviço

Preencha os seguintes campos:

- **Name:** `bodysport-backend` (ou o nome que preferir)
- **Region:** `Oregon` (mais próximo do Brasil) ou `Frankfurt`
- **Branch:** `main` ou `master`
- **Root Directory:** `backend` ⚠️ **MUITO IMPORTANTE**
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`

#### C. Variáveis de Ambiente

No Render, vá em **Environment** e adicione:

| Variável | Valor | Onde encontrar |
|----------|-------|----------------|
| `DATABASE_URL` | Sua Connection String do Neon | Painel do Neon → Connection String |
| `FLASK_ENV` | `production` | - |
| `FLASK_DEBUG` | `False` | - |
| `JWT_SECRET_KEY` | Uma chave aleatória (ex: `abc123xyz789...`) | Gere uma chave segura |
| `PORT` | **Deixe vazio** | Render define automaticamente |

**⚠️ IMPORTANTE sobre DATABASE_URL:**
- Use a Connection String completa do Neon (começa com `postgresql://...`)
- Não use `localhost` - use a URL do Neon que permite conexões externas

#### D. Finalizar Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build completar (2-5 minutos)
3. Você receberá uma URL tipo: `https://bodysport-backend.onrender.com`
4. Teste acessando: `https://sua-url.onrender.com/api/health`
   - Deve retornar: `{"status": "ok", "message": "API está funcionando"}`

---

### 3️⃣ Deploy do Frontend (Site)

#### Opção A: Render Static Site (Recomendado)

1. No Render, clique em **"New +"** → **"Static Site"**
2. Conecte o mesmo repositório
3. Configure:
   - **Name:** `bodysport-frontend`
   - **Root Directory:** `public`
   - **Build Command:** (deixe vazio)
   - **Publish Directory:** `public`
4. Clique em **"Create Static Site"**

#### Opção B: Netlify (Alternativa mais fácil)

1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `public` ou conecte o repositório
3. Configure:
   - **Publish directory:** `public`
4. Deploy automático!

---

### 4️⃣ Atualizar URL da API no Frontend

Após fazer deploy do backend, você precisa atualizar a URL da API no frontend.

#### Método 1: Atualizar nos arquivos JS (Recomendado)

Edite os arquivos:
- `src/js/main.js` (linha 7)
- `src/js/desenvolver.js` (linha 397)

Substitua:
```javascript
: 'https://bodysport-backend.onrender.com'); // ⚠️ ATUALIZE COM SUA URL DO RENDER
```

Por sua URL real do Render:
```javascript
: 'https://sua-url-real.onrender.com');
```

Depois faça commit e push:
```bash
git add .
git commit -m "Atualizar URL da API para produção"
git push
```

O Render vai fazer redeploy automaticamente.

#### Método 2: Usar arquivo config.js (Alternativa)

Crie `public/config.js`:
```javascript
window.API_URL = 'https://sua-url-backend.onrender.com';
```

E adicione no `index.html` antes dos outros scripts:
```html
<script src="config.js"></script>
```

---

## ✅ Checklist de Deploy

### Antes de Começar:
- [ ] Banco de dados no Neon criado e funcionando
- [ ] Tabelas criadas (execute `database_setup.sql` no Neon)
- [ ] Backend testado localmente
- [ ] Conta no Render criada
- [ ] Código commitado no Git

### Durante o Deploy:
- [ ] Backend criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Build do backend completou com sucesso
- [ ] Health check funciona (`/api/health`)
- [ ] Frontend deployado
- [ ] URL da API atualizada no frontend

### Após o Deploy:
- [ ] Testar formulário de orçamento no site
- [ ] Verificar se dados são salvos no banco
- [ ] Testar todas as funcionalidades
- [ ] Verificar logs no Render (se houver erros)

---

## 🐛 Problemas Comuns

### Erro: "Module not found"
**Solução:** Verifique se `requirements.txt` tem todas as dependências. O build command deve ser: `pip install -r requirements.txt`

### Erro: "Database connection failed"
**Solução:**
1. Verifique se `DATABASE_URL` está correta nas variáveis de ambiente
2. Confirme que o Neon permite conexões externas
3. Teste a Connection String no DBeaver primeiro

### Erro: "Port already in use"
**Solução:** Não configure a variável `PORT` - o Render define automaticamente. O código já está preparado para isso.

### Site não carrega CSS/JS
**Solução:** Verifique se o `Root Directory` está correto (`public` para frontend, `backend` para backend)

### CORS Error
**Solução:** O CORS já está configurado no backend. Se persistir, verifique se a URL do frontend está permitida.

---

## 💰 Custos

### Render Free Tier:
- ✅ 750 horas/mês grátis
- ✅ Web Services podem "dormir" após inatividade (primeira requisição pode demorar ~30s)
- ✅ Static Sites sempre online
- ⚠️ Para produção real, considere upgrade para evitar "cold starts"

---

## 📚 Recursos Úteis

- [Documentação do Render](https://render.com/docs)
- [Documentação do Neon](https://neon.tech/docs)
- Ver logs: Dashboard → Seu serviço → **Logs**
- Reiniciar: Dashboard → Seu serviço → **Manual Deploy**

---

## 🎯 Resumo Rápido

1. **Backend:** Criar Web Service → Root: `backend` → Build: `pip install -r requirements.txt` → Start: `gunicorn app:app`
2. **Variáveis:** `DATABASE_URL`, `FLASK_ENV=production`, `JWT_SECRET_KEY`
3. **Frontend:** Criar Static Site → Root: `public` → Publish: `public`
4. **Atualizar:** URL da API nos arquivos JS do frontend
5. **Testar:** Acessar `/api/health` e testar formulários

---

**Pronto! Seu site estará no ar! 🚀**



