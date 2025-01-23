package types

type Stocks struct {
	ID       int     `json:"id"`
	Arg      string  `json:"arg"`
	Sector   string  `json:"sector"`
	Code     string  `json:"code"`
	PE_Ratio float32 `json:"pe_ratio"`
}
