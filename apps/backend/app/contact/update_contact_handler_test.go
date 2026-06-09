package contact

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUpdateContactHandler_Handle_HappyPath(t *testing.T) {
	database := setupTestDB(t)

	seedResult, err := database.ExecContext(
		context.Background(),
		"INSERT INTO contacts (name, email, phone, note) VALUES (?, ?, ?, ?)",
		"Old Name",
		"old@test.com",
		int64(100),
		"old note",
	)
	assert.NoError(t, err)

	contactID, err := seedResult.LastInsertId()
	assert.NoError(t, err)

	handler := NewUpdateContactHandler(database)
	request := &UpdateContactRequest{
		ID:    int32(contactID),
		Name:  "Alp",
		Email: "elmasalpemre@gmail.com",
		Phone: 123,
		Note:  "hello note",
	}

	response, err := handler.Handle(context.Background(), request)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.EqualValues(t, request.ID, response.Contact.ID)
	assert.Equal(t, request.Name, response.Contact.Name)
	assert.Equal(t, request.Email, response.Contact.Email)
	assert.Equal(t, request.Phone, response.Contact.Phone)
	assert.Equal(t, request.Note, response.Contact.Note)
}

func TestUpdateContactHandler_Handle_NotFound(t *testing.T) {
	database := setupTestDB(t)

	handler := NewUpdateContactHandler(database)
	request := &UpdateContactRequest{
		ID:    int32(999), // Non-existent ID
		Name:  "Alp",
		Email: "elmasalpemre@gmail.com",
		Phone: 123,
		Note:  "hello note",
	}

	_, err := handler.Handle(context.Background(), request)

	assert.Error(t, err)
}

func TestUpdateContactHandler_Handle_ExistingPhone(t *testing.T) {
	database := setupTestDB(t)

	seedResult, err := database.ExecContext(
		context.Background(),
		"INSERT INTO contacts (name, email, phone, note) VALUES (?, ?, ?, ?)",
		"Old Name",
		"old@test.com",
		int64(100),
		"old note",
	)
	assert.NoError(t, err)

	contactID, err := seedResult.LastInsertId()
	assert.NoError(t, err)

	handler := NewUpdateContactHandler(database)
	request := &UpdateContactRequest{
		ID:    int32(contactID),
		Name:  "Old Name",
		Email: "old@new.com",
		Phone: int64(101),
		Note:  "old note",
	}

	response, err := handler.Handle(context.Background(), request)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.EqualValues(t, request.ID, response.Contact.ID)
	assert.Equal(t, request.Name, response.Contact.Name)
	assert.Equal(t, request.Email, response.Contact.Email)
	assert.Equal(t, request.Phone, response.Contact.Phone)
	assert.Equal(t, request.Note, response.Contact.Note)
}
