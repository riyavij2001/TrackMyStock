package userstocks

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
)

type UserStocksHandler struct {
	store types.UserStocksStore
}

func NewHandler(store types.UserStocksStore) *UserStocksHandler {
	return &UserStocksHandler{store: store}
}

func (h *UserStocksHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/addStock", h.addUserStock).Methods("POST")
	router.HandleFunc("/removeStock", h.removeUserStock).Methods("DELETE")
	router.HandleFunc("/getStock", h.getUserStocks).Methods("GET")
}

func (h *UserStocksHandler) getUserStocks(w http.ResponseWriter, r *http.Request) {
	var user types.UserStocksPayload
	if err := utils.ParseJSON(r, &user); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	fmt.Println("Recieved:", "User ID:", user.UserID)

	if err := utils.Validate.Struct(user); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", errors))
		return
	}

	// get all stocks
	stocks, err := h.store.GetUserStocks(user.UserID)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the user: %v", user.UserID))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string][]types.Stocks{"stocks": stocks})
}

func (h *UserStocksHandler) addUserStock(w http.ResponseWriter, r *http.Request) {

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User Created"})
}
func (h *UserStocksHandler) removeUserStock(w http.ResponseWriter, r *http.Request) {

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User Created"})
}
