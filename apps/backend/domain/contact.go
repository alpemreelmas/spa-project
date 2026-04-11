package domain

type Contact struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone int32  `json:"phone"`
	Note  string `json:"note"`
}
