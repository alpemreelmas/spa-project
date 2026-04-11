package contact

import (
	"context"

	"github.com/alpemreelmas/spa-contact/domain"
)

type GetContactRequest struct {
}

type GetContactResponse struct {
	Contact domain.Contact `json:"contact"`
}

type GetContactHandler struct {
}

func NewGetContactHandler() *GetContactHandler {
	return &GetContactHandler{}
}

func (h *GetContactHandler) Handle(ctx context.Context, req *GetContactRequest) (*GetContactResponse, error) {
	return &GetContactResponse{Contact: domain.Contact{}}, nil
}
