package stock_details

import (
	"github.com/riyavij2001/TrackMyStock/types"
)

type StockDetailsHandler struct {
	store types.StockDetailsStore
}

func NewHandler(store types.StockDetailsStore) *StockDetailsHandler {
	return &StockDetailsHandler{store: store}
}
