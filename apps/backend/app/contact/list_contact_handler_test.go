package contact

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestListContactHandler_Handle(t *testing.T) {
	testCases := []struct {
		name string
		seed []CreateContactRequest
	}{
		{
			name: "returns one contact",
			seed: []CreateContactRequest{{
				Name:  "Alp",
				Email: "alp@test.com",
				Phone: 123,
				Note:  "hello note",
			}},
		},
		{
			name: "returns multiple contacts",
			seed: []CreateContactRequest{
				{
					Name:  "Alp",
					Email: "alp@test.com",
					Phone: 123,
					Note:  "hello note",
				},
				{
					Name:  "NoNote",
					Email: "no@note.com",
					Phone: 111,
					Note:  "",
				},
			},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			database := setupTestDB(t)

			for _, contactRequest := range testCase.seed {
				_, err := database.ExecContext(
					context.Background(),
					"INSERT INTO contacts (name, email, phone, note) VALUES (?, ?, ?, ?)",
					contactRequest.Name,
					contactRequest.Email,
					contactRequest.Phone,
					contactRequest.Note,
				)
				assert.NoError(t, err)
			}

			handler := NewListContactHandler(database)

			response, err := handler.Handle(context.Background(), &ListContactRequest{})

			assert.NoError(t, err)
			assert.Len(t, response.Contacts, len(testCase.seed))

			expectedByEmail := make(map[string]CreateContactRequest, len(testCase.seed))
			for _, contactRequest := range testCase.seed {
				expectedByEmail[contactRequest.Email] = contactRequest
			}

			for _, contact := range response.Contacts {
				expected, ok := expectedByEmail[contact.Email]
				assert.True(t, ok)
				assert.NotZero(t, contact.ID)
				assert.Equal(t, expected.Name, contact.Name)
				assert.Equal(t, expected.Phone, contact.Phone)
				assert.Equal(t, expected.Note, contact.Note)
			}
		})
	}
}
