package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

var DB *sqlx.DB

func Init(dsnUri string) {
	var err error
	DB, err = sqlx.Connect("sqlite3", dsnUri)
	if err != nil {
		zap.L().Error("Failed to connect to database", zap.Error(err))
		panic(fmt.Errorf("fatal error unmarshalling config: %w", err))

	}

	err = DB.Ping()
	if err != nil {
		zap.L().Error("Failed to ping database", zap.Error(err))
		panic(fmt.Errorf("fatal error unmarshalling config: %w", err))
	}

	zap.L().Info("SQLite connected successfully")

}
