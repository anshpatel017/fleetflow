import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def inspect_db():
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME', 'fleetflow'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'postgres'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432')
    )
    cur = conn.cursor()
    
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = [t[0] for t in cur.fetchall()]
    print(f"Tables found: {tables}")
    
    for table in tables:
        cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}'")
        cols = cur.fetchall()
        print(f"Table {table} columns: {cols}")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    inspect_db()
