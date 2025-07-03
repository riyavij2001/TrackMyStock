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
	referenceStore   types.ReferenceStore
}

func NewHandler(store types.UserStocksStore, stockStore types.StocksStore, stockdetailStore types.StockDetailsStore, userStore types.UserStore, referenceStore types.ReferenceStore) *UserStocksHandler {
	return &UserStocksHandler{store: store, stockStore: stockStore, stockdetailStore: stockdetailStore, userStore: userStore, referenceStore: referenceStore}
}

func (h *UserStocksHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/addStock", auth.WithJWTAuth(h.addUserStock, h.userStore)).Methods("POST")
	router.HandleFunc("/removeStock", auth.WithJWTAuth(h.removeUserStock, h.userStore)).Methods("DELETE")
	router.HandleFunc("/getStock", auth.WithJWTAuth(h.getUserStocks, h.userStore)).Methods("GET")
	router.HandleFunc("/getCategorizedStocks", auth.WithJWTAuth(h.getCategorizedStocksHandler, h.userStore)).Methods("POST")
	router.HandleFunc("/setNextNotification", auth.WithJWTAuth(h.setNextNotification, h.userStore)).Methods("POST")
	router.HandleFunc("/subscribe", auth.WithJWTAuth(h.subscribe, h.userStore)).Methods("POST")
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
			utils.LogMessage(utils.ERROR, "could not get for arg:", a)
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
			stock, err := h.scrapeAndStoreStock(a)
			if err != nil {
				utils.LogMessage(utils.ERROR, "Error scraping stock:", err)
				continue
			}
			err = h.store.AddUserStock(userId, []int{stock.ID})

			if err != nil {
				utils.LogMessage(utils.ERROR, "Error mapping stock to user:", err)
				return
			}

			utils.LogMessage(utils.INFO, "Successfully added stock details for:", a)
		}

	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User Stocks Added"})
}

func (h *UserStocksHandler) removeUserStock(w http.ResponseWriter, r *http.Request) {
	// Flow:
	// 1: Get user ID from request
	// 2: Get stock ID from request
	// 3: Remove stock from user's stocks
	// 4: Write JSON response
	userId := auth.GetUserIDFromContext(r.Context())

	var requestBody struct {
		Ids []int `json:"ids"`
	}

	if err := utils.ParseJSON(r, &requestBody); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	err := h.store.RemoveUserStock(userId, requestBody.Ids)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User Stocks Removed"})

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

func (h *UserStocksHandler) sendSubMail(userId int, args []string) {
	utils.LogMessage(utils.INFO, "UserId:", userId, "Args:", args)
	userDetails, err := h.userStore.GetUserById(userId)

	if err != nil {
		fmt.Errorf("Could not find the user: ", err)
		return
	}

	stocksList, err := h.getCategorizedStocks(args)
	// utils.LogMessage(utils.INFO, "Stocks List:", stocksList)

	if err != nil {
		fmt.Errorf("Could not find the user: ", err)
		return
	}

	htmlContent, _ := utils.RenderTemplate(stocksList, userDetails.FirstName)
	if userDetails.NotificationFrequency != 0 {
		reference, err := h.referenceStore.GetReferenceByID(userDetails.NotificationFrequency)
		if err != nil {
			fmt.Errorf("Could not find the reference: ", err)
			return
		}
		now := time.Now()
		err = h.store.SetNextNotification(userId, now.AddDate(0, 0, reference.Value))
		if err != nil {
			fmt.Errorf("Could not set next notification: ", err)
		}
		utils.LogMessage(utils.INFO, "User's next notification set")
	}
	h.store.SendSubMail(htmlContent, userDetails.FirstName, userDetails.Email)
}

func (h *UserStocksHandler) getCategorizedStocks(args []string) (types.SectorStocks, error) {
	stocksList := types.SectorStocks{}

	for _, arg := range args {
		stock, err := h.stockStore.GetStockByArg(arg)
		if err != nil || stock == nil {
			utils.LogMessage(utils.ERROR, "Could not find for the arg:", arg)
			continue
		}
		stock_detail, err := h.stockdetailStore.GetStockDetailsAllDates(stock.ID)

		/*
			TODO: 1. Get Previous Week data if exists
			TODO: 2. Get today data
				TODO: 2.1 If not exists, fetch
		*/

		if err != nil {
			utils.LogMessage(utils.ERROR, "Could not find stock details for the arg:", arg, "id:", string(stock.ID))
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

func (h *UserStocksHandler) setNextNotification(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())

	var requestBody struct {
		StockID          int       `json:"stock_id"`
		NextNotification time.Time `json:"next_notification"`
	}

	if err := utils.ParseJSON(r, &requestBody); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Validate that the stock belongs to the user
	stocks, err := h.store.GetUserStocks(userId)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the user stocks: %v", err))
		return
	}

	stockFound := false
	for _, stock := range stocks {
		if stock.ID == requestBody.StockID {
			stockFound = true
			break
		}
	}

	if !stockFound {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("stock with ID %d does not belong to user", requestBody.StockID))
		return
	}

	// Update the next notification date
	err = h.store.SetNextNotification(userId, requestBody.NextNotification)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to set next notification: %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "Next notification date set successfully"})
}

func (h *UserStocksHandler) subscribe(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())

	var requestBody struct {
		StockIDs []string `json:"stock_ids"`
	}

	if err := utils.ParseJSON(r, &requestBody); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Validate that the stock belongs to the user
	stocks, err := h.store.GetUserStocks(userId)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the user stocks: %v", err))
		return
	}

	//If stock not present previously, add to user stocks
	for _, stockID := range requestBody.StockIDs {
		if !containsStock(stocks, stockID) {
			savedStock, err := h.stockStore.GetStockByArg(stockID)
			if err != nil || savedStock == nil {
				utils.LogMessage(utils.INFO, "Could not find stock, scraping:", stockID)
				savedStock, err = h.scrapeAndStoreStock(stockID)
				if err != nil {
					utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to scrape and store stock: %v", err))
					return
				}
				if savedStock == nil {
					utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to scrape and store stock: %v", err))
					return
				}
			}
			err = h.store.AddUserStock(userId, []int{savedStock.ID})
			if err != nil {
				utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to add stock to user: %v", err))
				return
			}
		}
	}

	stocks, err = h.store.GetUserStocks(userId)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the user stocks: %v", err))
		return
	}
	//Send Mail to for all the stocks
	go h.sendSubMail(userId, getStockIDs(stocks))
	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "User subscribed to stock successfully"})
}

func containsStock(stocks []types.Stocks, stockID string) bool {
	for _, stock := range stocks {
		if stock.Code == stockID {
			return true
		}
	}
	return false
}

func getStockIDs(stocks []types.Stocks) []string {
	ids := make([]string, 0, len(stocks))
	for _, stock := range stocks {
		ids = append(ids, stock.Code)
	}
	return ids
}

func (h *UserStocksHandler) scrapeAndStoreStock(arg string) (stock *types.Stocks, err error) {
	c := colly.NewCollector()

	// Variables to store scraped data
	var sector, code string
	var close, altman, fScore, sloanRatio float64

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
			}
		}
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
	err = c.Visit("https://www.topstockresearch.com/rt/Stock/" + arg + "/BirdsEyeView")
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error visiting BirdsEyeView page for", arg, ":", err.Error())
		return nil, err
	}

	// Scrape fundamentals page
	err = c.Visit("https://www.topstockresearch.com/rt/Stock/" + arg + "/FundamentalAnalysis")
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error visiting Fundamental Analysis page for", arg, ":", err.Error())
	}

	utils.LogMessage(utils.INFO, "arg:", arg, "code:", code, "sector", sector, "altman:", altman, "sloan", sloanRatio, "fscore:", fScore)

	// Store the stock and stock details
	err = h.stockStore.AddStock(types.Stocks{Arg: arg, Code: code, Sector: sector, PE_Ratio: 0.0})
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error adding stock to DB:", err)
		return nil, err
	}
	// Retrieve the stock after insertion
	stock, _ = h.stockStore.GetStockByArg(arg)

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
		utils.LogMessage(utils.ERROR, "Error adding stock details:", err.Error())
		return nil, err
	}

	return stock, nil
}
