import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def run_schema():
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME', 'fleetflow'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'postgres'),
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432')
        )
        cur = conn.cursor()
        
        # Read schema.sql
        with open('schema.sql', 'r') as f:
            sql = f.read()
        
        # Execute schema
        cur.execute(sql)
        conn.commit()
        print("Schema applied successfully.")
        
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    run_schema()
