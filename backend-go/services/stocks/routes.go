package stocks

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/gocolly/colly/v2"
	"github.com/gorilla/mux"
	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
)

type Handler struct {
	store types.StocksStore
}

type StockResponse struct {
	ID    string `json:"id"`
	Label string `json:"label"`
}

func NewHandler(store types.StocksStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/fetchStockData", fetchStockData).Methods("GET")
	router.HandleFunc("/fetchStockDetails", fetchStockDetails).Methods("GET")
}

func fetchStockData(w http.ResponseWriter, r *http.Request) {
	term := r.URL.Query().Get("term")

	if term == "" {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("missing 'term' in request"))
		return
	}
	// The URL for the external API
	url := fmt.Sprintf("https://www.topstockresearch.com/rt/Search.tsr?eqSubCat=any&indi=any&term=%s", term)

	// Create a new HTTP request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating request: %v", err), http.StatusInternalServerError)
		return
	}

	// Make the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error making request: %v", err), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	utils.LogMessage(utils.INFO, "BODY: ", body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error reading response: %v", err), http.StatusInternalServerError)
		return
	}

	// Declare a slice to hold the parsed response
	var rawResponse []map[string]interface{}
	err = json.Unmarshal(body, &rawResponse)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error unmarshaling response: %v", err), http.StatusInternalServerError)
		return
	}

	// Filter out only stock data (no screener items)
	var stocks []StockResponse
	for _, item := range rawResponse {
		utils.LogMessage(utils.INFO, "ITEM:", item["id"], "LABEL:", item["label"])
		// Check if "id" contains "/Stock/"
		if id, exists := item["id"].(string); exists && containsStock(id) {
			// Add "Stock ID" attribute
			utils.LogMessage(utils.INFO, "Found Stock")
			startIdx := strings.Index(id, "/Stock/") + len("/Stock/")
			endIdx := strings.Index(id, "/BirdsEyeView")
			stock := StockResponse{
				ID:    id[startIdx:endIdx],
				Label: item["label"].(string),
			}
			stocks = append(stocks, stock)
		}
	}

	// Set the correct content-type for the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)

	// Return the filtered stock data
	if err := json.NewEncoder(w).Encode(stocks); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
		return
	}
}

func fetchStockDetails(w http.ResponseWriter, r *http.Request) {
	stock_id := r.URL.Query().Get("stock_id")

	if stock_id == "" {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("missing 'stock_id' in request"))
		return
	}

	stock_details, err := scrapStockDetails(stock_id)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the stock: %v", stock_id))
		return
	}

	utils.WriteJSON(w, http.StatusOK, stock_details)

}

// Helper function to check if the ID contains "/Stock/"
func containsStock(id string) bool {
	// Compile the regex to check for "/Stock/" in the string
	re := regexp.MustCompile(`/Stock/`)

	utils.LogMessage(utils.INFO, "isStock: ", re.MatchString(id))

	// Return true if the regex finds a match
	return re.MatchString(id)
}

func scrapStockDetails(id string) (types.StockFetchDetails, error) {
	// Colly collector
	c := colly.NewCollector()

	// Variables to store scraped data
	var sector, code, industry, change string
	var close, altman, fScore, sloanRatio, pe, roe float64

	// Scrape Birds Eye View
	c.OnHTML("tr", func(e *colly.HTMLElement) {
		// Get the cells in each row
		cells := e.ChildTexts("td")
		utils.LogMessage(utils.INFO, "Cells - Birds:", cells)

		if len(cells) == 2 {
			label := strings.TrimSpace(cells[0])
			value := strings.TrimSpace(cells[1])

			// Extract sector, close, and code
			if strings.HasPrefix(label, "Sect") {
				sector = value
			} else if strings.HasPrefix(label, "Close") {
				close, _ = strconv.ParseFloat(value, 64)
			} else if strings.HasPrefix(label, "Code") {
				code = value
			} else if strings.HasPrefix(label, "Indus") {
				industry = value
			} else if strings.HasPrefix(label, "Change") {
				change = value
			}
		}
	})
	c.OnHTML(".item", func(e *colly.HTMLElement) {
		e.DOM.Find("h6").Each(func(_ int, h6 *goquery.Selection) {
			if strings.HasPrefix(h6.Text(), "PE") {
				h3 := h6.NextFiltered("h3")
				if h3 != nil {
					pe, _ = strconv.ParseFloat(h3.Text(), 64)
				}
			} else if strings.HasPrefix(h6.Text(), "ROE") {
				h3 := h6.NextFiltered("h3")
				if h3 != nil {
					roe, _ = strconv.ParseFloat(h3.Text(), 64)
				}
			}
		})
	})

	// Scrape Fundamentals
	c.OnHTML("tr", func(e *colly.HTMLElement) {
		// Get the cells in each row
		cells := e.ChildTexts("td")
		utils.LogMessage(utils.INFO, "Cells - Funda:", cells)

		if len(cells) == 2 {
			label := strings.TrimSpace(cells[0])
			value := strings.TrimSpace(cells[1])

			// Extract altman, f_score, and sloan ratio
			if strings.HasPrefix(label, "Altman") {
				altman, _ = strconv.ParseFloat(value, 64)
			} else if strings.HasPrefix(label, "Piotroski") {
				fScore, _ = strconv.ParseFloat(value, 64)
			} else if strings.HasPrefix(label, "Sloan") {
				sloanRatio, _ = strconv.ParseFloat(value, 64)
			}
		}
	})

	// Start the scraping process for both pages
	err := c.Visit("https://www.topstockresearch.com/rt/Stock/" + id + "/BirdsEyeView")
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error visiting BirdsEyeView page for", id, ":", err.Error())
		return types.StockFetchDetails{}, err
	}

	// Scrape fundamentals page
	err = c.Visit("https://www.topstockresearch.com/rt/Stock/" + id + "/FundamentalAnalysis")
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error visiting Fundamental Analysis page for", id, ":", err.Error())
		return types.StockFetchDetails{}, err
	}

	utils.LogMessage(utils.INFO, "ID:", id, "Successful")

	return types.StockFetchDetails{
		ID:           id,
		Name:         code,
		Close:        close,
		AltmanZScore: altman,
		FScore:       int(fScore),
		SloanRatio:   sloanRatio,
		Change:       change,
		Industry:     industry,
		Sector:       sector,
		PERatio:      pe,
		ROE:          roe,
	}, nil
}
