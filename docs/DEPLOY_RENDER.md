# 🚀 Guia de Deploy no Render

## ✅ Pré-requisitos

Antes de fazer deploy, certifique-se de que:

- [ ] Base de dados no Neon está criada e funcionando
- [ ] Tabelas foram criadas (execute `database_setup.sql`)
- [ ] Backend funciona localmente
- [ ] Conta no [Render](https://render.com) criada

---

## 📋 Checklist Antes do Deploy

### Backend
- [x] `requirements.txt` existe ✅
- [x] `Procfile` criado ✅
- [x] `runtime.txt` criado ✅
- [x] `app.py` configurado ✅
- [ ] Testado localmente

### Frontend
- [ ] URL da API configurável
- [ ] CORS configurado no backend ✅

---

## 🔧 Passo a Passo: Deploy do Backend

### 1. Preparar Repositório Git

```bash
# Se ainda não tem Git inicializado
git init
git add .
git commit -m "Preparar para deploy"
```

### 2. Criar Serviço no Render

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório (GitHub/GitLab/Bitbucket)
4. Ou faça deploy manual via Git

### 3. Configurar o Serviço

**Configurações Básicas:**
- **Name:** `bodysport-backend` (ou o nome que preferir)
- **Region:** Escolha a mais próxima (ex: `Oregon` para Brasil)
- **Branch:** `main` ou `master`
- **Root Directory:** `backend` ⚠️ **IMPORTANTE**
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`

### 4. Configurar Variáveis de Ambiente

No Render, vá em **Environment** e adicione:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Sua Connection String do Neon |
| `FLASK_ENV` | `production` |
| `FLASK_DEBUG` | `False` |
| `JWT_SECRET_KEY` | Uma chave secreta aleatória |
| `PORT` | Deixe vazio (Render define automaticamente) |

**⚠️ IMPORTANTE:**
- A `DATABASE_URL` deve ser a Connection String completa do Neon
- Não use `localhost` - use a URL do Neon
- O Render define a porta automaticamente (não precisa configurar)

### 5. Deploy

1. Clique em **"Create Web Service"**
2. O Render vai:
   - Clonar seu repositório
   - Instalar dependências
   - Iniciar o servidor
3. Aguarde o build completar (2-5 minutos)
4. Você verá uma URL tipo: `https://bodysport-backend.onrender.com`

### 6. Verificar se Funcionou

1. Acesse: `https://sua-url.onrender.com/api/health`
2. Deve retornar: `{"status": "ok", "message": "API está funcionando"}`

---

## 🌐 Deploy do Frontend (Opções)

### Opção 1: Render Static Site (Recomendado)

1. No Render, clique em **"New +"** → **"Static Site"**
2. Conecte o repositório
3. **Root Directory:** `public`
4. **Build Command:** (deixe vazio ou `npm install` se usar build)
5. **Publish Directory:** `public`

**⚠️ IMPORTANTE:** Você precisa atualizar a URL da API no frontend!

### Opção 2: Netlify/Vercel (Alternativa)

- **Netlify:** Mais fácil para sites estáticos
- **Vercel:** Excelente para frontend moderno

---

## 🔗 Configurar Frontend para Produção

O frontend precisa saber a URL do backend em produção.

### Método 1: Variável de Ambiente no Build (Recomendado)

Crie um arquivo `public/config.js`:

```javascript
// config.js
window.API_URL = 'https://sua-url-backend.onrender.com';
```

E adicione no HTML antes dos outros scripts:

```html
<script src="config.js"></script>
```

### Método 2: Atualizar Diretamente no Código

Atualize `src/js/main.js` e `src/js/desenvolver.js`:

```javascript
// Para produção, use a URL do Render
const API_URL = window.API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://sua-url-backend.onrender.com');
```

### Método 3: Usar Variável de Ambiente (Render Static)

No Render Static Site, adicione variável de ambiente e use no build.

---

## 📝 Arquivos Criados para Deploy

### `backend/Procfile`
```
web: gunicorn app:app
```
- Define como iniciar o servidor em produção

### `backend/runtime.txt`
```
python-3.11.7
```
- Define versão do Python (opcional, mas recomendado)

---

## 🔐 Segurança em Produção

### ✅ Já Implementado:
- Hash de senhas (bcrypt)
- Validação de entrada
- CORS configurado
- Prepared statements (SQL injection protection)

### ⚠️ A Fazer:
- [ ] Usar HTTPS (Render faz automaticamente)
- [ ] Configurar JWT para autenticação
- [ ] Rate limiting (limitar requisições)
- [ ] Logs de erro adequados

---

## 🐛 Troubleshooting

### Erro: "Module not found"

**Solução:**
- Verifique se `requirements.txt` tem todas as dependências
- Adicione: `pip install -r requirements.txt` no build command

### Erro: "Database connection failed"

**Solução:**
1. Verifique se `DATABASE_URL` está correta nas variáveis de ambiente
2. Confirme que o Neon permite conexões externas
3. Teste a Connection String no DBeaver

### Erro: "Port already in use"

**Solução:**
- O Render define a porta automaticamente via `PORT` env var
- Certifique-se de que `app.py` usa: `os.getenv("PORT", 5000)`

### Site não carrega CSS/JS

**Solução:**
- Verifique os caminhos relativos no HTML
- Certifique-se de que `Root Directory` está correto no Render

### CORS Error

**Solução:**
- Já está configurado (`CORS(app)`)
- Se persistir, adicione no backend:
  ```python
  CORS(app, resources={r"/api/*": {"origins": ["https://seu-site.onrender.com"]}})
  ```

---

## 📊 Estrutura de Deploy Recomendada

```
Render:
├── Web Service (Backend)
│   ├── Root: backend/
│   ├── Build: pip install -r requirements.txt
│   ├── Start: gunicorn app:app
│   └── Env Vars: DATABASE_URL, JWT_SECRET_KEY, etc.
│
└── Static Site (Frontend)
    ├── Root: public/
    ├── Build: (vazio ou npm install)
    └── Publish: public/
```

---

## 💰 Custos

### Render Free Tier:
- ✅ 750 horas/mês grátis
- ✅ Web Services podem "dormir" após inatividade
- ✅ Static Sites sempre online
- ⚠️ Primeira requisição após dormir pode demorar ~30s

### Para Produção Real:
- Considere upgrade para evitar "cold starts"
- Ou use serviços como Railway, Fly.io (alternativas)

---

## ✅ Checklist Final de Deploy

### Antes de Fazer Deploy:
- [ ] Backend testado localmente
- [ ] Base de dados criada no Neon
- [ ] Tabelas criadas
- [ ] `.env` funciona localmente
- [ ] Git commit feito

### Durante Deploy:
- [ ] Backend criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Build completou com sucesso
- [ ] Health check funciona (`/api/health`)
- [ ] Frontend atualizado com URL do backend
- [ ] Frontend deployado

### Após Deploy:
- [ ] Testar formulário no site
- [ ] Verificar se dados são salvos no banco
- [ ] Testar todas as funcionalidades
- [ ] Verificar logs no Render

---

## 🚀 Comandos Úteis

### Ver Logs no Render:
- Acesse o dashboard → Seu serviço → **Logs**

### Reiniciar Serviço:
- Dashboard → Seu serviço → **Manual Deploy** → **Deploy latest commit**

### Atualizar Variáveis:
- Dashboard → Seu serviço → **Environment** → Editar

---

## 📚 Recursos

- [Render Docs](https://render.com/docs)
- [Gunicorn Docs](https://gunicorn.org/)
- [Neon Docs](https://neon.tech/docs)

---

**Última atualização:** 2025-01-27

