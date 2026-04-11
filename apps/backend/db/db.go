package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

func Init(dsnUri string) *sqlx.DB {
	var err error
	var DB *sqlx.DB
	DB, err = sqlx.Connect("sqlite", dsnUri)
	if err != nil {
		zap.L().Error("Failed to connect to database", zap.Error(err))
		panic(fmt.Errorf("fatal error unmarshalling config: %w", err))

	}

	err = DB.Ping()
	if err != nil {
		zap.L().Error("Failed to ping database", zap.Error(err))
		panic(fmt.Errorf("fatal error unmarshalling config: %w", err))
	}

	setupSchemas(DB)

	zap.L().Info("SQLite connected successfully")
	return DB
}

func setupSchemas(database *sqlx.DB) {
	schema := `CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone INTEGER,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);

`

	_, err := database.Exec(schema)
	if err != nil {
		zap.L().Error("Failed to create table", zap.Error(err))
		panic(fmt.Errorf("fatal error creating table: %w", err))
	}
}
