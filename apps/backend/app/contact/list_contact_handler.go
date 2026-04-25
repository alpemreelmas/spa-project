package contact

import (
	"context"
	"strings"

	"github.com/alpemreelmas/spa-contact/domain"
	"github.com/jmoiron/sqlx"
)

type ListContactRequest struct {
	Search string `query:"search"`
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
	c := make([]domain.Contact, 0)
	search := strings.TrimSpace(req.Search)

	query := "SELECT * FROM contacts"
	args := []any{}

	if search != "" {
		query += " WHERE LOWER(name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(note) LIKE LOWER(?)"
		pattern := "%" + search + "%"
		args = append(args, pattern, pattern, pattern)
	}

	query += " ORDER BY id DESC"

	err := h.db.SelectContext(ctx, &c, query, args...)
	if err != nil {
		return nil, err
	}
	return &ListContactResponse{Contacts: c}, nil
}
