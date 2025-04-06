CREATE TABLE IF NOT EXISTS reference (
	`id` INT NOT NULL AUTO_INCREMENT,
	`display_val` VARCHAR(255),
	`value` INT DEFAULT NULL,
	PRIMARY KEY (`id`)
);

-- Insert default notification frequency options
INSERT INTO reference (display_val, value) VALUES 
('Daily', 1),
('Weekly', 7),
('Monthly', 30);