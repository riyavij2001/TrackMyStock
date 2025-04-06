package types

type StockFetchDetails struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Close        float64 `json:"close"`
	AltmanZScore float64 `json:"altman_z_score"`
	FScore       int     `json:"f_score"`
	SloanRatio   float64 `json:"sloan_ratio"`
	Change       float64 `json:"change"`
	Industry     string  `json:"industry"`
	Sector       string  `json:"sector"`
	PERatio      float64 `json:"pe_ratio"`
	ROE          float64 `json:"roe"`
}
