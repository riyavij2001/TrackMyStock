CREATE TABLE IF NOT EXISTS user_stocks (
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NULL DEFAULT NULL,
	`stock_id` INT NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
);
