package userstocks

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
	"github.com/gorilla/mux"
	"github.com/riyavij2001/TrackMyStock/services/auth"
	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
)

type UserStocksHandler struct {
	store            types.UserStocksStore
	stockStore       types.StocksStore
	stockdetailStore types.StockDetailsStore
	userStore        types.UserStore
}

func NewHandler(store types.UserStocksStore, stockStore types.StocksStore, stockdetailStore types.StockDetailsStore, userStore types.UserStore) *UserStocksHandler {
	return &UserStocksHandler{store: store, stockStore: stockStore, stockdetailStore: stockdetailStore, userStore: userStore}
}

func (h *UserStocksHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/addStock", auth.WithJWTAuth(h.addUserStock, h.userStore)).Methods("POST")
	router.HandleFunc("/removeStock", auth.WithJWTAuth(h.removeUserStock, h.userStore)).Methods("DELETE")
	router.HandleFunc("/getStock", auth.WithJWTAuth(h.getUserStocks, h.userStore)).Methods("GET")
	router.HandleFunc("/getCategorizedStocks", auth.WithJWTAuth(h.getCategorizedStocksHandler, h.userStore)).Methods("POST")
}

func (h *UserStocksHandler) getUserStocks(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())

	fmt.Println("Recieved:", "User ID:", userId)

	// get all stocks
	stocks, err := h.store.GetUserStocks(userId)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the user: %v", userId))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string][]types.Stocks{"stocks": stocks})
}

func (h *UserStocksHandler) addUserStock(w http.ResponseWriter, r *http.Request) {

	userId := auth.GetUserIDFromContext(r.Context())

	var requestBody struct {
		Args []string `json:"args"`
	}

	if err := utils.ParseJSON(r, &requestBody); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// get all stocks
	prevStocks, _ := h.store.GetUserStocks(userId)

	for _, a := range requestBody.Args {
		stock, err := h.stockStore.GetStockByArg(a)
		// The stock does not exist
		if err != nil {
			utils.LogMessage(utils.ERROR, "could not get for arg: "+a)
		} else {
			if prevStocks == nil {
				h.store.AddUserStock(userId, []int{stock.ID})
				continue
			} else {
				found := false
				for _, s := range prevStocks {
					if s.ID == stock.ID {
						found = true
						break
					}
				}
				if !found {
					h.store.AddUserStock(userId, []int{stock.ID})
					continue
				}
			}

		}

		// If stock doesn't exist, scrape data
		if stock == nil {
			// Colly collector
			c := colly.NewCollector()

			// Variables to store scraped data
			var sector, code string
			var close, altman, fScore, sloanRatio float64

			// Scrape Birds Eye View
			c.OnHTML("tr", func(e *colly.HTMLElement) {
				// Get the cells in each row
				cells := e.ChildTexts("td")
				utils.LogMessage(utils.INFO, "Cells - Birds:"+strings.Join(cells, " "))

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
					}
				}
			})

			// Scrape Fundamentals
			c.OnHTML("tr", func(e *colly.HTMLElement) {
				// Get the cells in each row
				cells := e.ChildTexts("td")
				utils.LogMessage(utils.INFO, "Cells - Funda:"+strings.Join(cells, " "))

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
			err := c.Visit("https://www.topstockresearch.com/rt/Stock/" + a + "/BirdsEyeView")
			if err != nil {
				utils.LogMessage(utils.ERROR, "Error visiting BirdsEyeView page for "+a+": "+err.Error())
				continue
			}

			// Scrape fundamentals page
			err = c.Visit("https://www.topstockresearch.com/rt/Stock/" + a + "/FundamentalAnalysis")
			if err != nil {
				utils.LogMessage(utils.ERROR, "Error visiting Fundamental Analysis page for "+a+": "+err.Error())
			}

			utils.LogMessage(utils.ERROR, "arg:", a, "code:", code, "sector", sector, "altman:", altman, "sloan", sloanRatio, "fscore:", fScore)

			// Store the stock and stock details
			err = h.stockStore.AddStock(types.Stocks{Arg: a, Code: code, Sector: sector, PE_Ratio: 0.0})
			if err != nil {
				utils.LogMessage(utils.ERROR, "Error adding stock to DB:", err)
				continue
			}
			// Retrieve the stock after insertion
			stock, _ = h.stockStore.GetStockByArg(a)

			err = h.store.AddUserStock(userId, []int{stock.ID})

			if err != nil {
				utils.LogMessage(utils.ERROR, "Error mapping stock to user:", err)
				return
			}

			// Add stock details (make sure you have the correct date and other values)
			err = h.stockdetailStore.AddStockDetails(types.StockDetails{
				StockID:      stock.ID,
				Close:        close,
				Date:         time.Now(),
				AltmanZScore: altman,
				FScore:       int(fScore),
				SloanRatio:   sloanRatio * 100,
			})
			if err != nil {
				utils.LogMessage(utils.ERROR, "Error adding stock details:"+err.Error())
				continue
			}

			utils.LogMessage(utils.INFO, "Successfully added stock details for:"+a)
		}

	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User Stocks Added"})
}

func (h *UserStocksHandler) removeUserStock(w http.ResponseWriter, r *http.Request) {

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User Created"})

}

func (h *UserStocksHandler) getCategorizedStocksHandler(w http.ResponseWriter, r *http.Request) {

	var requestBody struct {
		Args []string `json:"args"`
	}

	if err := utils.ParseJSON(r, &requestBody); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	stocksList, err := h.getCategorizedStocks(requestBody.Args)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, stocksList)

}

func (h *UserStocksHandler) sendSubMail(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())

	var requestBody struct {
		Args []string `json:"args"`
	}

	if err := utils.ParseJSON(r, &requestBody); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	userDetails, err := h.userStore.GetUserById(userId)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	stocksList, err := h.getCategorizedStocks(requestBody.Args)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	htmlContent, _ := utils.RenderTemplate(stocksList, userDetails.FirstName)

	h.store.SendSubMail(htmlContent, userDetails.FirstName, userDetails.Email)

	utils.WriteJSON(w, http.StatusCreated, stocksList)

}

func (h *UserStocksHandler) getCategorizedStocks(args []string) (types.SectorStocks, error) {
	stocksList := types.SectorStocks{}

	for _, arg := range args {
		stock, err := h.stockStore.GetStockByArg(arg)
		if err != nil || stock == nil {
			utils.LogMessage(utils.ERROR, "Could not find for the arg:"+arg)
			continue
		}
		stock_detail, err := h.stockdetailStore.GetStockDetailsAllDates(stock.ID)

		/*
			TODO: 1. Get Previous Week data if exists
			TODO: 2. Get today data
				TODO: 2.1 If not exists, fetch
		*/

		if err != nil {
			utils.LogMessage(utils.ERROR, "Could not find stock details for the arg:"+arg+"id:"+string(stock.ID))
			continue
		}

		sector := stock.Sector

		for _, sd := range stock_detail {
			fullDetail := turnStockIntoFullDetails(*stock, sd)
			stocksList.Add(sector, fullDetail)
		}

	}
	return stocksList, nil
}

func turnStockIntoFullDetails(stock types.Stocks, details types.StockDetails) types.StockFullDetails {
	return types.StockFullDetails{
		ID:     stock.ID,
		Date:   details.Date,
		Code:   stock.Code,
		Close:  details.Close,
		Sector: stock.Sector,
		Altman: details.AltmanZScore,
		Sloan:  details.SloanRatio,
		FScore: details.FScore,
	}
}
