package main

import (
	"database/sql"
	"log"

	"github.com/go-sql-driver/mysql"
	"github.com/riyavij2001/TrackMyStock/cmd/api"
	"github.com/riyavij2001/TrackMyStock/config"
	"github.com/riyavij2001/TrackMyStock/db"
	"github.com/riyavij2001/TrackMyStock/utils"
)

func main() {
	mysqlConfig := mysql.Config{
		User:                 config.Envs.DBUser,
		Passwd:               config.Envs.DBPassword,
		Addr:                 config.Envs.DBAddress,
		DBName:               config.Envs.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true,
		ParseTime:            true,
	}
	db, err := db.NewMySQLStorage(&mysqlConfig)
	if err != nil {
		log.Fatal(err.Error())
	}
	checkAndInitDBStorage(db)
	server := api.NewAPIServer(":8181", db)
	if err := server.Run(); err != nil {
		utils.LogMessage(utils.ERROR, "Could not run the server")
	}
}

func checkAndInitDBStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatal("Could not ping the DB")
	}
	utils.LogMessage(utils.INFO, "Connected to the DB")
}
