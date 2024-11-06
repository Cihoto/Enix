CREATE TABLE common_movement (
    id INT PRIMARY KEY,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    income BOOLEAN NOT NULL,
    amount INT NOT NULL,
    active BOOLEAN NOT NULL,
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES business(id)
);

CREATE TABLE movement_common_movement (
    id INT PRIMARY KEY,
    printDate DATE NOT NULL,
    printDateTimestamp INT NOT NULL,
    total INT NOT NULL,
   `name` VARCHAR(255) NOT NULL,
   `desc` TEXT NOT NULL,
    common_movement_id INT NOT NULL,
    active BOOLEAN NOT NULL,
    FOREIGN KEY (common_movement_id) REFERENCES common_movement(id)
);