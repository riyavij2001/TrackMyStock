package types

import "time"

type StockDetails struct {
	ID           int       `json:"id"`
	Date         time.Time `json:"date"`
	Close        float64   `json:"close"`
	AltmanZScore float64   `json:"altman_z_score"`
	FScore       int       `json:"f_score"`
	SloanRatio   float64   `json:"sloan_ratio"`
	StockID      int       `json:"stock_id"`
}

type StockDetailsStore interface {
	GetStockDetailsAllDates(stockID int) ([]StockDetails, error)
	AddStockDetails(StockDetails) error
}
