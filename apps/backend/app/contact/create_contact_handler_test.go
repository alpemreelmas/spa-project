package contact

import (
	"context"
	"testing"

	"github.com/alpemreelmas/spa-contact/db"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	_ "modernc.org/sqlite"
)

func setupTestDB(t *testing.T) *sqlx.DB {
	t.Helper()

	testDB := sqlx.MustConnect("sqlite", ":memory:")
	db.SetupSchemas(testDB)
	t.Cleanup(func() {
		_ = testDB.Close()
	})

	return testDB
}

func TestCreateContactHandler_Handle(t *testing.T) {
	testCases := []struct {
		name string
		req  *CreateContactRequest
	}{
		{
			name: "with note",
			req: &CreateContactRequest{
				Name:  "Alp",
				Email: "alp@test.com",
				Phone: 123,
				Note:  "hello note",
			},
		},
		{
			name: "without note",
			req: &CreateContactRequest{
				Name:  "NoNote",
				Email: "no@note.com",
				Phone: 111,
				Note:  "",
			},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			database := setupTestDB(t)
			handler := NewCreateContactHandler(database)

			response, err := handler.Handle(context.Background(), testCase.req)

			assert.NoError(t, err)
			assert.NotZero(t, response.Contact.ID)
			assert.Equal(t, testCase.req.Name, response.Contact.Name)
			assert.Equal(t, testCase.req.Email, response.Contact.Email)
			assert.Equal(t, testCase.req.Phone, response.Contact.Phone)
			assert.Equal(t, testCase.req.Note, response.Contact.Note)
		})
	}
}

func TestCreateContactHandler_Handle_DuplicateEmailReturnsError(t *testing.T) {
	database := setupTestDB(t)
	handler := NewCreateContactHandler(database)

	firstResponse, err := handler.Handle(context.Background(), &CreateContactRequest{
		Name:  "First",
		Email: "duplicate@test.com",
		Phone: 100,
		Note:  "initial",
	})
	assert.NoError(t, err)
	assert.NotZero(t, firstResponse.Contact.ID)

	secondResponse, secondErr := handler.Handle(context.Background(), &CreateContactRequest{
		Name:  "Second",
		Email: "duplicate@test.com",
		Phone: 200,
		Note:  "duplicate",
	})

	assert.Error(t, secondErr)
	assert.Nil(t, secondResponse)
}
