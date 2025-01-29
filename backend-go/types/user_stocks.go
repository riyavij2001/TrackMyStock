package types

type UserStocks struct {
	ID      int `json:"id"`
	UserID  int `json:"user_id"`
	StockID int `json:"stock_id"`
}

type UserStocksStore interface {
	GetUserStocks(int) ([]Stocks, error)
	AddUserStock(userID int, stockIDs []int) error
	RemoveUserStock(int, int) error
	SendSubMail(htmlContent string, recipientName string, recipientEmail string) error
}

type UserStockDataPayload struct {
	UserID int      `json:"user_id"`
	Stocks []string `json:"stocks"`
}

type UserStocksPayload struct {
	UserID int `json:"user_id"`
}
