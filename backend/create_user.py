"""
Script para criar um usuário de teste no banco de dados
Execute: python create_user.py
"""
import bcrypt
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def create_user(email, senha_plana, nome):
    """Cria um novo usuário com senha hash"""
    
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ ERRO: DATABASE_URL não encontrada no arquivo .env")
        return False
    
    try:
        # Hash da senha
        print(f"🔐 Gerando hash da senha para {email}...")
        senha_hash = bcrypt.hashpw(senha_plana.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Conectar ao banco
        print("🔌 Conectando ao banco de dados...")
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Verificar se usuário já existe
        cur.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
        if cur.fetchone():
            print(f"⚠️  Usuário {email} já existe!")
            cur.close()
            conn.close()
            return False
        
        # Inserir usuário
        print("👤 Criando usuário...")
        cur.execute(
            "INSERT INTO usuarios (email, senha, nome) VALUES (%s, %s, %s) RETURNING id",
            (email, senha_hash, nome)
        )
        
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"✅ Usuário criado com sucesso!")
        print(f"   ID: {user_id}")
        print(f"   Email: {email}")
        print(f"   Nome: {nome}")
        print(f"   Senha: {senha_plana} (hash armazenado)")
        
        return True
        
    except psycopg2.IntegrityError:
        print(f"❌ ERRO: Email {email} já está em uso")
        return False
        
    except psycopg2.Error as e:
        print(f"❌ ERRO ao criar usuário: {e}")
        return False
        
    except Exception as e:
        print(f"❌ ERRO inesperado: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("👤 Criar Usuário - BodySport")
    print("=" * 50)
    print()
    
    # Dados padrão (você pode modificar)
    email = input("Email: ").strip() or "admin@bodysport.com"
    senha = input("Senha: ").strip() or "admin123"
    nome = input("Nome: ").strip() or "Administrador"
    
    print()
    success = create_user(email, senha, nome)
    
    if success:
        print("\n" + "=" * 50)
        print("✅ Usuário criado com sucesso!")
        print("=" * 50)
    else:
        print("\n" + "=" * 50)
        print("❌ Falha ao criar usuário")
        print("=" * 50)

