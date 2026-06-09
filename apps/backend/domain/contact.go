package domain

type Contact struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     int64  `json:"phone"`
	Note      string `json:"note"`
	CreatedAt string `json:"created_at" db:"created_at"`
	UpdatedAt string `json:"updated_at" db:"updated_at"`
}
