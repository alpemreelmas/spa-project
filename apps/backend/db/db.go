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

	SetupSchemas(DB)
	SeedContacts(DB)

	zap.L().Info("SQLite connected successfully")
	return DB
}

func SetupSchemas(database *sqlx.DB) {
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

func SeedContacts(database *sqlx.DB) {
	var count int
	err := database.Get(&count, "SELECT COUNT(*) FROM contacts")
	if err != nil {
		zap.L().Error("Failed to count contacts", zap.Error(err))
		panic(fmt.Errorf("fatal error counting contacts: %w", err))
	}

	if count > 0 {
		return
	}

	seed := `INSERT INTO contacts (name, email, phone, note) VALUES
		('Ada Lovelace', 'ada@example.com', 5011002000, 'First demo contact'),
		('Grace Hopper', 'grace@example.com', 5011002001, 'Backend API reviewer'),
		('Alan Turing', 'alan@example.com', 5011002002, 'Search and sorting sample'),
		('Katherine Johnson', 'katherine@example.com', 5011002003, 'Numeric phone attribute sample');`

	_, err = database.Exec(seed)
	if err != nil {
		zap.L().Error("Failed to seed contacts", zap.Error(err))
		panic(fmt.Errorf("fatal error seeding contacts: %w", err))
	}
}
