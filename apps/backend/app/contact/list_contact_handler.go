package contact

import (
	"context"

	"github.com/alpemreelmas/spa-contact/domain"
)

type ListContactRequest struct {
}

type ListContactResponse struct {
	Contacts []domain.Contact `json:"contacts"`
}

type ListContactHandler struct {
}

func NewListContactHandler() *ListContactHandler {
	return &ListContactHandler{}
}

func (h *ListContactHandler) Handle(ctx context.Context, req *ListContactRequest) (*ListContactResponse, error) {
	return &ListContactResponse{Contacts: []domain.Contact{}}, nil
}
