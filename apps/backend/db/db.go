package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

var DB *sqlx.DB

func Init(dsnUri string) {
	var err error
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

	setupSchemas()

	zap.L().Info("SQLite connected successfully")

}

func setupSchemas() {
	schema := `CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone INTEGER,
    note TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);

`

	_, err := DB.Exec(schema)
	if err != nil {
		zap.L().Error("Failed to create table", zap.Error(err))
		panic(fmt.Errorf("fatal error creating table: %w", err))
	}
}
