CREATE TABLE IF NOT EXISTS user_stocks (
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NULL DEFAULT NULL,
	`stock_id` INT NULL DEFAULT NULL,
	`next_notification` TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`),
	FOREIGN KEY (`stock_id`) REFERENCES stocks(`id`)
);
