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

func (s *Store) GetStockByArg(arg string) (*types.Stocks, error) {
	query := `SELECT id, arg, sector, code, pe_ratio FROM stocks WHERE arg = ? LIMIT 1`
	rows, err := s.db.Query(query, arg)

	if err != nil {
		log.Println("DB Error getting stock by arg:", err)
		return nil, err
	}
	var stock *types.Stocks
	for rows.Next() {
		stock, err = ScanRowIntoStock(rows)
		if err != nil {
			// Log the error and return it
			log.Println("Error reading stock by arg:", err)
			return nil, err
		}

	}

	return stock, nil
}

// GetStockById retrieves a stock by its ID.
func (s *Store) GetStockById(id int) (*types.Stocks, error) {
	query := `SELECT id, arg, sector, code, pe_ratio FROM stocks WHERE id = ? LIMIT 1`
	rows, err := s.db.Query(query, id)

	if err != nil {
		log.Println("DB Error getting stock by id:", err)
		return nil, err
	}

	stock, err := ScanRowIntoStock(rows)
	if err != nil {
		// Log the error and return it
		log.Println("Error getting stock by id:", err)
		return nil, err
	}

	return stock, nil
}

// GetStockByIds retrieves multiple stocks by their IDs.
func (s *Store) GetStockByIds(ids []int) ([]types.Stocks, error) {
	// Create a query with placeholders for each ID in the slice
	query := `SELECT id, arg, sector, code, pe_ratio FROM stocks WHERE id IN (`
	placeholders := []interface{}{}
	for i := range ids {
		// Add placeholders for each id
		query += "?,"
		placeholders = append(placeholders, ids[i])
	}
	// Remove the trailing comma
	query = query[:len(query)-1]
	query += ")"

	rows, err := s.db.Query(query, placeholders...)
	if err != nil {
		// Log the error and return it
		log.Println("Error querying stocks by ids:", err)
		return nil, err
	}
	defer rows.Close()

	var stocks []types.Stocks
	for rows.Next() {
		stock, err := ScanRowIntoStock(rows)
		if err != nil {
			// Log the error but continue scanning the next rows
			log.Println("Error scanning stock row:", err)
			continue
		}
		stocks = append(stocks, *stock)
	}

	// Check if there were no rows found
	if len(stocks) == 0 {
		log.Println("No stocks found for the given ids")
		return nil, sql.ErrNoRows
	}

	return stocks, nil
}

func (s *Store) AddStock(stock types.Stocks) error {
	query := `INSERT INTO stocks (arg, sector, code, pe_ratio) VALUES (?, ?, ?, ?)`
	_, err := s.db.Exec(query, stock.Arg, stock.Sector, stock.Code, stock.PE_Ratio)
	if err != nil {
		// Log the error and return it
		log.Println("Error adding stock:", err)
		return err
	}
	return nil
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

func (s *Store) GetCategorizedStocks(args []string) ([]types.CategorizedStocks, error) {
	return nil, nil
}
