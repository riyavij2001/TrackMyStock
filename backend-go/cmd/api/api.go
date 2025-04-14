package api

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/riyavij2001/TrackMyStock/services/reference"
	"github.com/riyavij2001/TrackMyStock/services/stock_details"
	"github.com/riyavij2001/TrackMyStock/services/stocks"
	"github.com/riyavij2001/TrackMyStock/services/user"
	userstocks "github.com/riyavij2001/TrackMyStock/services/user_stocks"
	"github.com/rs/cors"
)

type APIServer struct {
	addr string
	db   *sql.DB
}

func NewAPIServer(addr string, db *sql.DB) *APIServer {
	return &APIServer{
		addr: addr,
		db:   db,
	}
}

// CORS middleware that allows specific origin and credentials
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow specific origin for better security
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173/")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// If it's a preflight request, return a successful response.
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()
	// router.Use(CORS)
	subRouter := router.PathPrefix("/api/v1").Subrouter()

	userStore := user.NewStore(s.db)
	stockStore := stocks.NewStore(s.db)
	stockDetailsStore := stock_details.NewStore(s.db)
	userStocksStore := userstocks.NewStore(s.db)
	referenceStore := reference.NewStore(s.db)

	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subRouter)

	userStocksHandler := userstocks.NewHandler(userStocksStore, stockStore, stockDetailsStore, userStore)
	userStocksHandler.RegisterRoutes(subRouter)

	stocksHandler := stocks.NewHandler(stockStore)
	stocksHandler.RegisterRoutes(subRouter)

	referenceHandler := reference.NewHandler(referenceStore)
	referenceHandler.RegisterRoutes(subRouter)

	fmt.Println("Listening on ", s.addr)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})

	handler := c.Handler(router)
	return http.ListenAndServe(s.addr, handler)
}
