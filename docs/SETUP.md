# 🚀 Guia de Configuração - BodySport

## Pré-requisitos

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **Python** (versão 3.9 ou superior) - [Download](https://www.python.org/)
- **PostgreSQL** ou conta no **Neon** - [Neon](https://neon.tech/)

---

## 📦 Instalação do Frontend

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo desenvolvimento:**
```bash
npm run dev
```

3. **Build para produção:**
```bash
npm run build
```

---

## 🐍 Instalação do Backend

1. **Criar ambiente virtual:**
```bash
cd backend
python -m venv venv
```

2. **Ativar ambiente virtual:**
   - **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   - **Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```

3. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

4. **Configurar variáveis de ambiente:**
```bash
# Copiar o arquivo de exemplo
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac

# Editar o arquivo .env com suas credenciais
```

5. **Executar o servidor:**
```bash
python app.py
```

---

## 🗄️ Configuração do Banco de Dados

### Criar tabelas necessárias:

```sql
-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de orçamentos
CREATE TABLE orcamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_orcamentos_email ON orcamentos(email);
CREATE INDEX idx_orcamentos_status ON orcamentos(status);
```

---

## 🔧 Configuração para Modelagem 3D (Futuro)

### Instalar Three.js (já incluído no package.json)

```bash
npm install three
```

### Estrutura de pastas para modelos 3D:

```
BodySport/
└── public/
    └── assets/
        └── models/
            ├── bodykits/
            │   ├── civic-2022.glb
            │   └── golf-gti.glb
            └── cars/
                └── base-models/
```

### Exemplo de uso do Three.js:

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configurar cena, câmera e renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Carregar modelo 3D
const loader = new GLTFLoader();
loader.load('assets/models/bodykit.glb', (gltf) => {
    scene.add(gltf.scene);
});

// Controles de câmera
const controls = new OrbitControls(camera, renderer.domElement);
```

---

## 🚨 Problemas Comuns

### Frontend não carrega
- Verifique se o caminho do script está correto: `../bodysport.js`
- Certifique-se de que o servidor de desenvolvimento está rodando

### Backend não conecta ao banco
- Verifique a variável `DATABASE_URL` no arquivo `.env`
- Teste a conexão com: `psql $DATABASE_URL`

### Erro de CORS
- Certifique-se de que `Flask-CORS` está instalado
- Verifique se a URL do frontend está permitida no backend

---

## 📝 Próximos Passos

1. ✅ Configurar ambiente de desenvolvimento
2. ✅ Testar conexão com banco de dados
3. ⏳ Implementar autenticação JWT
4. ⏳ Criar visualizador 3D básico
5. ⏳ Sistema de upload de modelos 3D

---

## 🔗 Links Úteis

- [Three.js Documentation](https://threejs.org/docs/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

