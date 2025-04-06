package reference

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/riyavij2001/TrackMyStock/services/auth"
	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
)

type Handler struct {
	store types.ReferenceStore
}

func NewHandler(store types.ReferenceStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/getNotificationFrequencies", auth.WithJWTAuth(h.getNotificationFrequencies, nil)).Methods("GET")
}

func (h *Handler) getNotificationFrequencies(w http.ResponseWriter, r *http.Request) {
	references, err := h.store.GetAllReferences()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string][]types.Reference{"frequencies": references})
}
