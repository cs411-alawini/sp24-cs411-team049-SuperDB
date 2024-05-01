DELIMITER //

CREATE TRIGGER FormatAndValidateContactNumberBeforeInsert
BEFORE INSERT ON Property
FOR EACH ROW
BEGIN
    IF NEW.ContactNumber IS NOT NULL THEN
        IF CHAR_LENGTH(NEW.ContactNumber) != 10 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Contact number must be exactly 10 digits';
        ELSEIF SUBSTRING(NEW.ContactNumber, 1, 1) NOT IN ('2', '3', '4', '5', '6', '7', '8', '9') THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The first digit of the contact number must be between 2 and 9';
        ELSE
            SET NEW.ContactNumber = CONCAT(SUBSTRING(NEW.ContactNumber, 1, 3), '-', SUBSTRING(NEW.ContactNumber, 4, 3), '-', SUBSTRING(NEW.ContactNumber, 7, 4));
        END IF;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER FormatAndValidateContactNumberBeforeUpdate
BEFORE UPDATE ON Property
FOR EACH ROW
BEGIN
    IF NEW.ContactNumber IS NOT NULL THEN
        IF CHAR_LENGTH(NEW.ContactNumber) != 10 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Contact number must be exactly 10 digits';
        ELSEIF SUBSTRING(NEW.ContactNumber, 1, 1) NOT IN ('2', '3', '4', '5', '6', '7', '8', '9') THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The first digit of the contact number must be between 2 and 9';
        ELSE
            SET NEW.ContactNumber = CONCAT(SUBSTRING(NEW.ContactNumber, 1, 3), '-', SUBSTRING(NEW.ContactNumber, 4, 3), '-', SUBSTRING(NEW.ContactNumber, 7, 4));
        END IF;
    END IF;
END //

DELIMITER ;