package contact

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestListContactHandler_Handle(t *testing.T) {
	testCases := []struct {
		name          string
		seed          []CreateContactRequest
		request       ListContactRequest
		expectedCount int
		expectedEmail []string
	}{
		{
			name: "returns one contact",
			seed: []CreateContactRequest{{
				Name:  "Alp",
				Email: "alp@test.com",
				Phone: 123,
				Note:  "hello note",
			}},
			expectedCount: 1,
			expectedEmail: []string{"alp@test.com"},
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
			expectedCount: 2,
			expectedEmail: []string{"alp@test.com", "no@note.com"},
		},
		{
			name: "filters contacts by name email and note",
			seed: []CreateContactRequest{
				{
					Name:  "Alp",
					Email: "alp@test.com",
					Phone: 123,
					Note:  "hello note",
				},
				{
					Name:  "Zeynep",
					Email: "zeda@test.com",
					Phone: 456,
					Note:  "finance owner",
				},
				{
					Name:  "Mert",
					Email: "mert@test.com",
					Phone: 789,
					Note:  "design team",
				},
			},
			request:       ListContactRequest{Search: "fin"},
			expectedCount: 1,
			expectedEmail: []string{"zeda@test.com"},
		},
		{
			name: "filters contacts case-insensitively",
			seed: []CreateContactRequest{
				{
					Name:  "Alp",
					Email: "alp@test.com",
					Phone: 123,
					Note:  "hello note",
				},
				{
					Name:  "Mert",
					Email: "mert@test.com",
					Phone: 789,
					Note:  "design team",
				},
			},
			request:       ListContactRequest{Search: "ALP"},
			expectedCount: 1,
			expectedEmail: []string{"alp@test.com"},
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

			response, err := handler.Handle(context.Background(), &testCase.request)

			assert.NoError(t, err)
			assert.Len(t, response.Contacts, testCase.expectedCount)

			expectedByEmail := make(map[string]CreateContactRequest, len(testCase.seed))
			for _, contactRequest := range testCase.seed {
				expectedByEmail[contactRequest.Email] = contactRequest
			}

			actualEmails := make([]string, 0, len(response.Contacts))

			for _, contact := range response.Contacts {
				expected, ok := expectedByEmail[contact.Email]
				assert.True(t, ok)
				assert.NotZero(t, contact.ID)
				assert.Equal(t, expected.Name, contact.Name)
				assert.Equal(t, expected.Phone, contact.Phone)
				assert.Equal(t, expected.Note, contact.Note)
				actualEmails = append(actualEmails, contact.Email)
			}

			assert.ElementsMatch(t, testCase.expectedEmail, actualEmails)
		})
	}
}
