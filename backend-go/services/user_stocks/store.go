package userstocks

import (
	"database/sql"

	"github.com/riyavij2001/TrackMyStock/config"
	"github.com/riyavij2001/TrackMyStock/services/stocks"
	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
	"gopkg.in/gomail.v2"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetUserStocks(userID int) ([]types.Stocks, error) {
	rows, err := s.db.Query("SELECT * FROM user_stocks WHERE user_id = ?", userID)

	if err != nil {
		utils.LogMessage(utils.ERROR, "Error:", "Could not find the stocks for the user")
		return nil, err
	}

	var finalStocks []types.Stocks

	for rows.Next() {
		us, err := ScanRowIntoUserStocks(rows)
		if err != nil {
			utils.LogMessage(utils.ERROR, err)
			return nil, err
		}
		stcks, err := s.db.Query("SELECT * FROM stocks WHERE id = ?", us.StockID)

		for stcks.Next() {
			s, err := stocks.ScanRowIntoStock(stcks)
			if err != nil {
				utils.LogMessage(utils.ERROR, err)
				return nil, err
			}

			finalStocks = append(finalStocks, *s)
		}

	}
	return finalStocks, nil
}
func (s *Store) AddUserStock(userID int, stockIDs []int) error {
	query := `INSERT INTO user_stocks (user_id, stock_id) VALUES (?, ?)`

	// Start a transaction to ensure atomicity
	tx, err := s.db.Begin()
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error starting transaction:", err)
		return err
	}
	defer tx.Rollback() // Rollback if there's an error

	// Insert each stock association
	for _, stockID := range stockIDs {
		_, err := tx.Exec(query, userID, stockID)
		if err != nil {
			utils.LogMessage(utils.ERROR, "Error inserting stock for user:", err)
			return err // Exit immediately on error
		}
	}

	// Commit the transaction after all insertions are successful
	err = tx.Commit()
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error committing transaction:", err)
		return err
	}

	return nil
}

func (s *Store) RemoveUserStock(int, int) error { return nil }

func ScanRowIntoUserStocks(row *sql.Rows) (*types.UserStocks, error) {
	stock := new(types.UserStocks)
	err := row.Scan(
		&stock.ID,
		&stock.UserID,
		&stock.StockID,
	)
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error:", "could not scan into user stock")
		return nil, err
	}
	utils.LogMessage(utils.INFO, "Success:", "mapped the user stock")
	return stock, nil
}

func (s *Store) SendSubMail(htmlContent string, recipientName string, recipientEmail string) error {
	fromEmail := config.Envs.EmailUsername
	password := config.Envs.EmailPassword

	smtpServer := "smtp.gmail.com"
	smtpPort := 587
	message := gomail.NewMessage()
	message.SetHeader("From", fromEmail)
	message.SetHeader("To", recipientEmail)
	message.SetHeader("Subject", recipientName+" Portfolio Status")
	message.SetBody("text/html", htmlContent)

	// Send the email using SMTP
	dialer := gomail.NewDialer(smtpServer, smtpPort, fromEmail, password)
	if err := dialer.DialAndSend(message); err != nil {
		return err
	}

	return nil
}
