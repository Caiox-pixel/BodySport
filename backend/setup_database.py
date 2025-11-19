"""
Script para criar a base de dados automaticamente no Neon
Execute: python setup_database.py
"""
import psycopg2
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

def setup_database():
    """Executa o script SQL para criar todas as tabelas"""
    
    # Obter connection string
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ ERRO: DATABASE_URL não encontrada no arquivo .env")
        print("   Certifique-se de que o arquivo backend/.env existe e contém DATABASE_URL")
        return False
    
    try:
        print("🔌 Conectando ao banco de dados...")
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("📄 Lendo script SQL...")
        script_path = os.path.join(os.path.dirname(__file__), 'database_setup.sql')
        
        with open(script_path, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        print("⚙️  Executando script...")
        cur.execute(sql)
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("✅ Base de dados criada com sucesso!")
        print("\n📊 Tabelas criadas:")
        print("   - usuarios")
        print("   - orcamentos")
        print("   - modelos_3d")
        print("   - bodykits")
        print("\n🎉 Pronto para usar!")
        
        return True
        
    except FileNotFoundError:
        print("❌ ERRO: Arquivo database_setup.sql não encontrado")
        print(f"   Procurando em: {script_path}")
        return False
        
    except psycopg2.OperationalError as e:
        print("❌ ERRO de conexão:")
        print(f"   {e}")
        print("\n💡 Verifique:")
        print("   1. A Connection String no arquivo .env está correta?")
        print("   2. O projeto Neon está ativo?")
        print("   3. Sua conexão com a internet está funcionando?")
        return False
        
    except psycopg2.Error as e:
        print("❌ ERRO ao executar SQL:")
        print(f"   {e}")
        return False
        
    except Exception as e:
        print(f"❌ ERRO inesperado: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 Setup da Base de Dados - BodySport")
    print("=" * 50)
    print()
    
    success = setup_database()
    
    if not success:
        print("\n" + "=" * 50)
        print("❌ Falha ao criar base de dados")
        print("=" * 50)
        print("\n💡 Dica: Você também pode executar o script SQL manualmente")
        print("   no SQL Editor do Neon (mais fácil para iniciantes)")
        exit(1)
    else:
        exit(0)

