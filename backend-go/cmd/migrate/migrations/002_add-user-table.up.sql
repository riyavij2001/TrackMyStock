CREATE TABLE IF NOT EXISTS users (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notification_frequency` INT DEFAULT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY (email),
  FOREIGN KEY (notification_frequency) REFERENCES reference(id)

);
