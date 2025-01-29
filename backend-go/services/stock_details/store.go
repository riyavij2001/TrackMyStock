package stock_details

import (
	"database/sql"
	"log"
	"time"

	"github.com/riyavij2001/TrackMyStock/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

// GetStockDetailsAllDates retrieves all stock details for a given stock identifier (stock_id).
func (s *Store) GetStockDetailsAllDates(stockID int) ([]types.StockDetails, error) {
	// Query to select all stock details for the given stock_id
	query := `SELECT id, date, close, altman_z_score, f_score, sloan_ratio, stock_id 
              FROM stock_details WHERE stock_id = ? ORDER BY date DESC LIMIT 2`

	rows, err := s.db.Query(query, stockID)
	if err != nil {
		log.Println("Error querying stock details:", err)
		return nil, err
	}
	defer rows.Close()

	var stockDetailsList []types.StockDetails
	for rows.Next() {
		stockDetail, err := scanRowIntoStockDetail(rows)
		if err != nil {
			log.Println("Error scanning row:", err)
			continue // Skip this row and move to the next one
		}
		stockDetailsList = append(stockDetailsList, *stockDetail)
	}

	// Handle the case where no records are found
	if len(stockDetailsList) == 0 {
		log.Println("No stock details found for stock_id:", stockID)
		return nil, sql.ErrNoRows
	}

	return stockDetailsList, nil
}

// AddStockDetails inserts a new stock detail record into the database.
func (s *Store) AddStockDetails(stockDetail types.StockDetails) error {
	// Query to insert the stock details into the stock_details table
	query := `INSERT INTO stock_details (date, close, altman_z_score, f_score, sloan_ratio, stock_id) 
              VALUES (?, ?, ?, ?, ?, ?)`

	_, err := s.db.Exec(query,
		stockDetail.Date,
		stockDetail.Close,
		stockDetail.AltmanZScore,
		stockDetail.FScore,
		stockDetail.SloanRatio,
		stockDetail.StockID,
	)
	if err != nil {
		log.Println("Error adding stock details:", err)
		return err
	}
	return nil
}

// Helper function to scan a row into a StockDetails struct.
func scanRowIntoStockDetail(row *sql.Rows) (*types.StockDetails, error) {
	stockDetail := new(types.StockDetails)

	var date time.Time
	var altmanZScore sql.NullFloat64
	var sloanRatio sql.NullFloat64

	err := row.Scan(
		&stockDetail.ID,
		&date,
		&stockDetail.Close,
		&altmanZScore,
		&stockDetail.FScore,
		&sloanRatio,
		&stockDetail.StockID,
	)
	if err != nil {
		log.Println("Error scanning row into StockDetails:", err)
		return nil, err
	}

	// Set the date and optional fields (AltmanZScore, SloanRatio) appropriately
	stockDetail.Date = date
	if altmanZScore.Valid {
		stockDetail.AltmanZScore = altmanZScore.Float64
	} else {
		stockDetail.AltmanZScore = 0
	}
	if sloanRatio.Valid {
		stockDetail.SloanRatio = sloanRatio.Float64
	} else {
		stockDetail.SloanRatio = 0
	}

	log.Println("Successfully mapped stock detail")
	return stockDetail, nil
}
