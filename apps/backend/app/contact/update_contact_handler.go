package contact

import (
	"context"

	"github.com/alpemreelmas/spa-contact/domain"
)

type UpdateContactRequest struct {
}

type UpdateContactResponse struct {
	Contact domain.Contact `json:"contact"`
}

type UpdateContactHandler struct {
}

func NewUpdateContactHandler() *UpdateContactHandler {
	return &UpdateContactHandler{}
}

func (h *UpdateContactHandler) Handle(ctx context.Context, req *UpdateContactRequest) (*UpdateContactResponse, error) {
	return &UpdateContactResponse{Contact: domain.Contact{}}, nil
}
