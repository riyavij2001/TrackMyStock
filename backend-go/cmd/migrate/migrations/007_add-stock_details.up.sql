CREATE TABLE IF NOT EXISTS stock_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    close DOUBLE NOT NULL,
    altman_z_score DOUBLE NOT NULL,
    f_score INT NOT NULL,
    sloan_ratio DOUBLE NOT NULL,
    stock_id INT NOT NULL,
    FOREIGN KEY (stock_id) REFERENCES stocks(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
