import sqlite3

DB_PATH = "database.db"


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM User")
    users = cursor.fetchall()

    for user in users:
        print(user)

    # conn.commit()
    conn.close()


if __name__ == "__main__":
    main()
