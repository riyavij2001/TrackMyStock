package user

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetUserByEmail(email string) (*types.User, error) {
	utils.LogMessage(utils.INFO, "Checking email:", email)
	rows, err := s.db.Query("SELECT * FROM users WHERE email = ?", email)

	if err != nil {
		utils.LogMessage(utils.ERROR, "Error:", "db error: ", err)
		return nil, err
	}

	u := new(types.User)
	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			utils.LogMessage(utils.ERROR, "Error:", "could not scan into user")
			return nil, err
		}
	}
	if u.ID == 0 {
		utils.LogMessage(utils.ERROR, "Error:", "could not find the user")
		return nil, errors.New("could not find the user")
	}
	utils.LogMessage(utils.INFO, "Success:", "found the user!")
	return u, nil
}

func scanRowIntoUser(row *sql.Rows) (*types.User, error) {
	u := new(types.User)
	var notificationFrequency sql.NullInt32

	err := row.Scan(
		&u.ID,
		&u.FirstName,
		&u.LastName,
		&u.Email,
		&u.Password,
		&u.CreatedAt,
		&notificationFrequency,
	)
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error:", "could not scan into user")
		return nil, err
	}

	// Handle nullable notification_frequency
	if notificationFrequency.Valid {
		u.NotificationFrequency = int(notificationFrequency.Int32)
	} else {
		u.NotificationFrequency = 0
	}

	utils.LogMessage(utils.INFO, "Success:", "mapped the user")
	return u, nil
}

func (s *Store) GetUserById(id int) (*types.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE id = ?", id)
	if err != nil {
		return nil, err
	}

	u := new(types.User)
	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}

	if u.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return u, nil
}

func (s *Store) CreateUser(user types.User) error {
	_, err := s.db.Exec("INSERT INTO users (firstName, lastName, email, password, notification_frequency) VALUES (?, ?, ?, ?, 2)", user.FirstName, user.LastName, user.Email, user.Password)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) UpdateFrequency(id int, frequency int) error {
	_, err := s.db.Exec("UPDATE users SET notification_frequency = ? WHERE id = ?", frequency, id)
	if err != nil {
		return err
	}

	return nil
}
