package contact

import (
	"context"

	"github.com/alpemreelmas/spa-contact/domain"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

type UpdateContactRequest struct {
	ID    int32  `uri:"id" validate:"required,gte=1"`
	Name  string `json:"name" validate:"required,min=2,max=120"`
	Email string `json:"email" validate:"required,email,max=160"`
	Phone int64  `json:"phone" validate:"required,gte=1,lte=9999999999"`
	Note  string `json:"note" validate:"omitempty,max=255"`
}

type UpdateContactResponse struct {
	Contact domain.Contact `json:"contact"`
}

type UpdateContactHandler struct {
	database *sqlx.DB
}

func NewUpdateContactHandler(database *sqlx.DB) *UpdateContactHandler {
	return &UpdateContactHandler{database: database}
}

func (h *UpdateContactHandler) Handle(ctx context.Context, req *UpdateContactRequest) (*UpdateContactResponse, error) {
	zap.L().Info("Updating contact", zap.Int32("id", req.ID), zap.String("name", req.Name), zap.String("email", req.Email), zap.Int64("phone", req.Phone))
	result, err := h.database.ExecContext(ctx, "UPDATE contacts SET name = ?, email = ?, phone = ?, note = ? WHERE id = ?", req.Name, req.Email, req.Phone, req.Note, req.ID)
	if err != nil {
		return nil, err
	}
	result.RowsAffected()
	if err != nil {
		return nil, err
	}

	var contact domain.Contact
	err = h.database.GetContext(ctx, &contact, "SELECT * FROM contacts WHERE id = ?", req.ID)
	if err != nil {
		return nil, err
	}

	return &UpdateContactResponse{Contact: contact}, nil
}
