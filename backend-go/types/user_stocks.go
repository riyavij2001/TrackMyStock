package types

type UserStocks struct {
	ID      int `json:"id"`
	UserID  int `json:"user_id"`
	StockID int `json:"stock_id"`
}

type UserStocksStore interface {
	GetUserStocks(int) ([]Stocks, error)
	AddUserStock(int, []int) error
	RemoveUserStock(int, int) error
}
