package stocks

import (
	"database/sql"
	"log"

	"github.com/riyavij2001/TrackMyStock/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func ScanRowIntoStock(row *sql.Rows) (*types.Stocks, error) {
	stock := new(types.Stocks)
	// Using sql.NullFloat64 for PE_Ratio to handle possible NULL values
	var peRatio sql.NullFloat64
	err := row.Scan(
		&stock.ID,
		&stock.Arg,
		&stock.Sector,
		&stock.Code,
		&peRatio,
	)
	if err != nil {
		log.Println("Error:", "could not scan into stock")
		return nil, err
	}

	// Check if PE_Ratio is valid (not NULL)
	if peRatio.Valid {
		stock.PE_Ratio = float32(peRatio.Float64)
	} else {
		stock.PE_Ratio = 0 // Or use a sentinel value or leave it as a zero value
	}
	log.Println("Success:", "mapped the stock")
	return stock, nil
}
