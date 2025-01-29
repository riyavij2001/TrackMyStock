package types

import "time"

type Stocks struct {
	ID       int     `json:"id"`
	Arg      string  `json:"arg"`
	Sector   string  `json:"sector"`
	Code     string  `json:"code"`
	PE_Ratio float32 `json:"pe_ratio"`
}

type StockFullDetails struct {
	ID     int
	Date   time.Time
	Code   string
	Close  float64
	Sector string
	Altman float64
	Sloan  float64
	FScore int
}

type CategorizedStocks struct {
	Sector     string
	StocksList []StockFullDetails
}

type SectorStocks map[string][]StockFullDetails

func (s SectorStocks) Has(sector string) bool {
	_, ok := s[sector]
	return ok
}

func (s SectorStocks) Add(sector string, stockFullDetails StockFullDetails) {
	if s.Has(sector) {
		s[sector] = append(s[sector], stockFullDetails)
	} else {
		s[sector] = []StockFullDetails{stockFullDetails}
	}
}

func (s SectorStocks) Remove(sector string) {
	if s.Has(sector) {
		delete(s, sector)
	}
}

type StocksStore interface {
	GetStockByArg(string) (*Stocks, error)
	GetStockById(int) (*Stocks, error)
	GetStockByIds([]int) ([]Stocks, error)
	AddStock(Stocks) error
}
