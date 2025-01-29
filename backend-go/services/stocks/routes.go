package stocks

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"

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
	log.Println("BODY: ", body)
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
		log.Println("ITEM:", item["id"], "LABEL:", item["label"])
		// Check if "id" contains "/Stock/"
		if id, exists := item["id"].(string); exists && containsStock(id) {
			// Add "Stock ID" attribute
			log.Println("Found Stock")
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

// Helper function to check if the ID contains "/Stock/"
func containsStock(id string) bool {
	// Compile the regex to check for "/Stock/" in the string
	re := regexp.MustCompile(`/Stock/`)

	log.Println("isStock: ", re.MatchString(id))

	// Return true if the regex finds a match
	return re.MatchString(id)
}
