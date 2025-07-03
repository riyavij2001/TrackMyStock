package types

import "time"

type UserStore interface {
	GetUserByEmail(enmail string) (*User, error)
	GetUserById(id int) (*User, error)
	CreateUser(User) error
	UpdateFrequency(id int, frequency int) error
}

type User struct {
	ID                    int       `json:"id"`
	FirstName             string    `json:"firstName"`
	LastName              string    `json:"lastName"`
	Email                 string    `json:"email"`
	Password              string    `json:"-"`
	CreatedAt             time.Time `json:"createdAt"`
	NotificationFrequency int       `json:"notification_frequency"`
}

type RegisterAuthPayload struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=3,max=130"`
}

type LoginAuthPayload struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}
