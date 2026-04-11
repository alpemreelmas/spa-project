package contact

import (
	"context"

	"github.com/alpemreelmas/spa-contact/domain"
	"github.com/jmoiron/sqlx"
)

type ListContactRequest struct {
}

type ListContactResponse struct {
	Contacts []domain.Contact `json:"contacts"`
}

type ListContactHandler struct {
	db *sqlx.DB
}

func NewListContactHandler(db *sqlx.DB) *ListContactHandler {
	return &ListContactHandler{db: db}
}

func (h *ListContactHandler) Handle(ctx context.Context, req *ListContactRequest) (*ListContactResponse, error) {
	var c []domain.Contact;
	err := h.db.QueryRowx("SELECT city, telcode FROM place LIMIT 1").StructScan(&c)
	if err != nil {
		return nil, err
	}
	return &ListContactResponse{Contacts: c}, nil
}
