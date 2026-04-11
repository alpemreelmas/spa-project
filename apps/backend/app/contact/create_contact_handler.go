package contact

import (
	"context"

	"github.com/alpemreelmas/spa-contact/domain"
	"github.com/jmoiron/sqlx"
)

type CreateContactRequest struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required, email"`
	Phone int32  `json:"phone" validate:"gte=0,lte=9999999999"`
	Note  string `json:"note" validate:"max=255,omitempty"`
}

type CreateContactResponse struct {
	Contact domain.Contact `json:"contact"`
}

type CreateContactHandler struct {
	database *sqlx.DB
}

func NewCreateContactHandler(database *sqlx.DB) *CreateContactHandler {
	return &CreateContactHandler{
		database: database,
	}
}

func (h *CreateContactHandler) Handle(ctx context.Context, req *CreateContactRequest) (*CreateContactResponse, error) {
	result, err := h.database.ExecContext(ctx, "INSERT INTO contacts (name, email, phone, note) VALUES (?, ?, ?, ?)", req.Name, req.Email, req.Phone, req.Note)
	if err != nil {
		return nil, err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	var contact domain.Contact
	err = h.database.GetContext(ctx, &contact, "SELECT * FROM contacts WHERE id = ?", lastInsertID)
	if err != nil {
		return nil, err
	}
	return &CreateContactResponse{Contact: contact}, nil
}
