package contact

import (
	"context"

	"github.com/alpemreelmas/spa-contact/domain"
	"github.com/jmoiron/sqlx"
)

type GetContactRequest struct {
	ID int32 `uri:"id" validate:"required"`
}

type GetContactResponse struct {
	Contact domain.Contact `json:"contact"`
}

type GetContactHandler struct {
	database *sqlx.DB
}

func NewGetContactHandler(database *sqlx.DB) *GetContactHandler {
	return &GetContactHandler{database: database}
}

func (h *GetContactHandler) Handle(ctx context.Context, req *GetContactRequest) (*GetContactResponse, error) {
	var contact domain.Contact
	err := h.database.GetContext(ctx, &contact, "SELECT * FROM contacts WHERE id = ?", req.ID)
	if err != nil {
		return nil, err
	}
	return &GetContactResponse{Contact: contact}, nil
}
