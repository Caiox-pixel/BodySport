from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)  # permite comunicação do front com o back

# Conexão com o Neon
conn = psycopg2.connect(os.getenv("DATABASE_URL"))

@app.route("/api/orcamento", methods=["POST"])
def orcamento():
    data = request.json
    nome = data.get("nome")
    email = data.get("email")
    modelo = data.get("modelo")

    cur = conn.cursor()
    cur.execute("INSERT INTO orcamentos (nome, email, modelo) VALUES (%s, %s, %s)", (nome, email, modelo))
    conn.commit()
    cur.close()

    return jsonify({"mensagem": "Orçamento recebido!"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    senha = data.get("senha")
    cur = conn.cursor()
    cur.execute("SELECT * FROM usuarios WHERE email=%s AND senha=%s", (email, senha))
    user = cur.fetchone()
    cur.close()

    if user:
        return jsonify({"status": "ok"})
    return jsonify({"erro": "Usuário ou senha inválidos"}), 401

if __name__ == "__main__":
    app.run(debug=True)
