from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2 import pool
import os
from dotenv import load_dotenv
import bcrypt
import re
import json

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite comunicação do front com o back

# Configuração do pool de conexões
try:
    connection_pool = psycopg2.pool.SimpleConnectionPool(
        1, 20,
        os.getenv("DATABASE_URL")
    )
    if connection_pool:
        print("Pool de conexões criado com sucesso")
except (Exception, psycopg2.Error) as error:
    print(f"Erro ao criar pool de conexões: {error}")
    connection_pool = None

def get_db_connection():
    """Obtém uma conexão do pool"""
    if connection_pool:
        return connection_pool.getconn()
    return None

def return_db_connection(conn):
    """Retorna uma conexão ao pool"""
    if connection_pool:
        connection_pool.putconn(conn)

def validate_email(email):
    """Valida formato de email"""
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

@app.route("/api/orcamento", methods=["POST"])
def orcamento():
    try:
        data = request.json
        if not data:
            return jsonify({"erro": "Dados não fornecidos"}), 400

        nome = data.get("nome", "").strip()
        email = data.get("email", "").strip()
        modelo = data.get("modelo", "").strip()
        tipo = data.get("tipo", "geral")  # Novo campo para tipo de orçamento
        projeto = data.get("projeto")  # Dados do projeto (para desenvolvimento)
        telefone = data.get("telefone", "").strip()
        observacoes = data.get("observacoes", "").strip()

        # Validação
        if not nome or not email:
            return jsonify({"erro": "Nome e email são obrigatórios"}), 400
        
        # Para orçamentos gerais, modelo é obrigatório
        if tipo == "geral" and not modelo:
            return jsonify({"erro": "Modelo do carro é obrigatório"}), 400

        if not validate_email(email):
            return jsonify({"erro": "Email inválido"}), 400

        # Obter conexão do pool
        conn = get_db_connection()
        if not conn:
            return jsonify({"erro": "Erro de conexão com o banco de dados"}), 500

        try:
            cur = conn.cursor()
            # Inserir com campos adicionais se disponíveis
            if tipo == "desenvolvimento-bodykit" and projeto:
                # Salvar projeto como JSON na coluna observacoes (ou criar coluna específica)
                projeto_json = json.dumps(projeto) if projeto else None
                cur.execute(
                    "INSERT INTO orcamentos (nome, email, modelo, observacoes) VALUES (%s, %s, %s, %s) RETURNING id",
                    (nome, email, modelo or "Personalizado", projeto_json or observacoes)
                )
            else:
                cur.execute(
                    "INSERT INTO orcamentos (nome, email, modelo, observacoes) VALUES (%s, %s, %s, %s) RETURNING id",
                    (nome, email, modelo, observacoes)
                )
            conn.commit()
            orcamento_id = cur.fetchone()[0]
            cur.close()
            return jsonify({
                "mensagem": "Orçamento recebido com sucesso!",
                "id": orcamento_id
            }), 201
        except psycopg2.IntegrityError:
            conn.rollback()
            return jsonify({"erro": "Erro ao salvar orçamento"}), 400
        except Exception as e:
            conn.rollback()
            print(f"Erro ao inserir orçamento: {e}")
            return jsonify({"erro": "Erro interno do servidor"}), 500
        finally:
            return_db_connection(conn)

    except Exception as e:
        print(f"Erro na rota /api/orcamento: {e}")
        return jsonify({"erro": "Erro interno do servidor"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return jsonify({"erro": "Dados não fornecidos"}), 400

        email = data.get("email", "").strip()
        senha = data.get("senha", "").strip()

        if not email or not senha:
            return jsonify({"erro": "Email e senha são obrigatórios"}), 400

        if not validate_email(email):
            return jsonify({"erro": "Email inválido"}), 400

        # Obter conexão do pool
        conn = get_db_connection()
        if not conn:
            return jsonify({"erro": "Erro de conexão com o banco de dados"}), 500

        try:
            cur = conn.cursor()
            # Buscar usuário pelo email
            cur.execute("SELECT id, email, senha FROM usuarios WHERE email=%s", (email,))
            user = cur.fetchone()
            cur.close()

            if user:
                user_id, user_email, hashed_password = user
                # Verificar senha com bcrypt
                if bcrypt.checkpw(senha.encode('utf-8'), hashed_password.encode('utf-8')):
                    return jsonify({
                        "status": "ok",
                        "mensagem": "Login realizado com sucesso",
                        "user_id": user_id
                    })
                else:
                    return jsonify({"erro": "Usuário ou senha inválidos"}), 401
            else:
                return jsonify({"erro": "Usuário ou senha inválidos"}), 401
        except Exception as e:
            print(f"Erro ao verificar login: {e}")
            return jsonify({"erro": "Erro interno do servidor"}), 500
        finally:
            return_db_connection(conn)

    except Exception as e:
        print(f"Erro na rota /api/login: {e}")
        return jsonify({"erro": "Erro interno do servidor"}), 500

@app.route("/api/health", methods=["GET"])
def health():
    """Endpoint para verificar saúde da API"""
    return jsonify({
        "status": "ok",
        "message": "API está funcionando"
    })

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
