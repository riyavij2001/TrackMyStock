package user

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/riyavij2001/TrackMyStock/config"
	"github.com/riyavij2001/TrackMyStock/services/auth"
	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
)

type Handler struct {
	store types.UserStore
}

func NewHandler(store types.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.loginUser).Methods("POST")
	router.HandleFunc("/register", h.registerUser).Methods("POST")
	router.HandleFunc("/updateFrequency", auth.WithJWTAuth(h.updateFrequency, h.store)).Methods("POST")
}

func (h *Handler) loginUser(w http.ResponseWriter, r *http.Request) {
	var user types.LoginAuthPayload
	if err := utils.ParseJSON(r, &user); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	utils.LogMessage(utils.INFO, "Recieved:", "Email:", user.Email)

	if err := utils.Validate.Struct(user); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", errors))
		return
	}

	// check if user exists
	u, err := h.store.GetUserByEmail(user.Email)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the user: %v", user.Email))
		return
	}

	if err := auth.MatchPassword(user.Password, u.Password); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("could not find the user: %v", u.Password))
		return
	}

	secret := []byte(config.Envs.JWTSecret)
	token, err := auth.CreateJWT(secret, u.ID)
	if err != nil {
		utils.LogMessage(utils.ERROR, "Could not create token")
		utils.WriteError(w, http.StatusBadGateway, fmt.Errorf("not found, invalid email or password"))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"token": token})
}

func (h *Handler) registerUser(w http.ResponseWriter, r *http.Request) {
	var user types.RegisterAuthPayload
	if err := utils.ParseJSON(r, &user); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(user); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", errors))
		return
	}

	// check if user exists
	_, err := h.store.GetUserByEmail(user.Email)
	if err == nil {

		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user with email %s already exists", user.Email))
		return
	}

	hashPass, err := auth.HashPassword(user.Password)

	if err != nil {
		utils.WriteJSON(w, http.StatusBadGateway, err)
		utils.LogMessage(utils.ERROR, "Could not hash password")
		return
	}

	err = h.store.CreateUser(types.User{
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Password:  hashPass,
		Email:     user.Email,
	})

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "User Created"})
}

func (h *Handler) updateFrequency(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())
	utils.LogMessage(utils.INFO, fmt.Sprintf("Updating frequency for user %d", userId))
	var requestBody struct {
		Id int `json:"id"`
	}
	if err := utils.ParseJSON(r, &requestBody); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}
	err := h.store.UpdateFrequency(userId, requestBody.Id)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "Frequency Updated"})
}
