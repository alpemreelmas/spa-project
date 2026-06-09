package contact

import (
	"context"
	"github.com/jmoiron/sqlx"
)

type DeleteContactRequest struct {
	ID int32 `uri:"id" validate:"required,gte=1"`
}

type DeleteContactResponse struct {
}

type DeleteContactHandler struct {
	database *sqlx.DB
}

func NewDeleteContactHandler(database *sqlx.DB) *DeleteContactHandler {
	return &DeleteContactHandler{database: database}
}

func (h *DeleteContactHandler) Handle(ctx context.Context, req *DeleteContactRequest) (*DeleteContactResponse, error) {
	result, err := h.database.ExecContext(ctx, "DELETE FROM contacts WHERE id = ?", req.ID)
	if err != nil {
		return nil, err
	}
	_, err = result.RowsAffected()
	if err != nil {
		return nil, err
	}
	return &DeleteContactResponse{}, nil
}
