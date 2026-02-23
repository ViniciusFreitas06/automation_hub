import sqlite3

# Conectar ao banco existente
conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# Executar consulta
# cursor.execute("UPDATE user SET email = 'vinicius@example.com' WHERE id = 1")

# Buscar todos os registros
cursor.execute("SELECT * FROM user")
usuarios = cursor.fetchall()

# conn.commit()  # Salvar as alterações no banco

# Mostrar resultados
for usuario in usuarios:
    print(usuario)

conn.close()