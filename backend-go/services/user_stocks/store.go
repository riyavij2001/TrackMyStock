package userstocks

import (
	"database/sql"
	"log"

	"github.com/riyavij2001/TrackMyStock/services/stocks"
	"github.com/riyavij2001/TrackMyStock/types"
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
		log.Println("Error:", "Could not find the stocks for the user")
		return nil, err
	}

	var finalStocks []types.Stocks

	for rows.Next() {
		us, err := ScanRowIntoUserStocks(rows)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		stcks, err := s.db.Query("SELECT * FROM stocks WHERE id = ?", us.StockID)

		for stcks.Next() {
			s, err := stocks.ScanRowIntoStock(stcks)
			if err != nil {
				log.Println(err)
				return nil, err
			}

			finalStocks = append(finalStocks, *s)
		}

	}
	return finalStocks, nil
}
func (s *Store) AddUserStock(int, []string) error { return nil }
func (s *Store) RemoveUserStock(int, int) error   { return nil }

func ScanRowIntoUserStocks(row *sql.Rows) (*types.UserStocks, error) {
	stock := new(types.UserStocks)
	err := row.Scan(
		&stock.ID,
		&stock.UserID,
		&stock.StockID,
	)
	if err != nil {
		log.Println("Error:", "could not scan into user stock")
		return nil, err
	}
	log.Println("Success:", "mapped the user stock")
	return stock, nil
}
