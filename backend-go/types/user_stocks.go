package types

type UserStocks struct {
	ID      int `json:"id"`
	UserID  int `json:"user_id"`
	StockID int `json:"stock_id"`
}

type UserStocksStore interface {
	GetUserStocks(int) ([]Stocks, error)
	AddUserStock(int, []string) error
	RemoveUserStock(int, int) error
}

type UserStockDataPayload struct {
	UserID int      `json:"user_id"`
	Stocks []string `json:"stocks"`
}

type UserStocksPayload struct {
	UserID int `json:"user_id"`
}
