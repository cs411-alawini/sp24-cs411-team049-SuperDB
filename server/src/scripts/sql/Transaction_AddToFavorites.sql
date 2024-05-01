
DROP PROCEDURE IF EXISTS AddToFavorites;
DELIMITER //
CREATE PROCEDURE AddToFavorites(IN pid BIGINT, IN uid INT)
proc_label: BEGIN
    DECLARE new_favorite_id INT;
    DECLARE listing_id INT;
    DECLARE available_date DATE;
    DECLARE favorite_count INT;

    SET new_favorite_id = 0;
    SET listing_id = NULL;
    SET available_date = NULL;
    SET favorite_count = 0;

    SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    START TRANSACTION;
        SELECT COALESCE(fav_counts.fav_count, 0) INTO favorite_count
        FROM User u
        LEFT JOIN (
            SELECT UserID, COUNT(*) AS fav_count
            FROM Favorites
            GROUP BY UserID
        ) AS fav_counts ON u.UserID = fav_counts.UserID
        WHERE u.UserID = uid;

        IF favorite_count < 100 THEN
            SELECT ListingID, AvailableDate INTO listing_id, available_date FROM Listing WHERE PropertyID = pid;

            IF listing_id IS NOT NULL AND available_date > CURDATE() THEN
                SELECT COALESCE(MAX(FavoriteID), 0) + 1 INTO new_favorite_id FROM Favorites;

                INSERT INTO Favorites (FavoriteID, UserID, ListingID, PriceAtFavTime, FavTime, PropertyID)
                VALUES (new_favorite_id, uid, listing_id, 0, CURRENT_TIMESTAMP, pid);

                UPDATE Favorites AS f
                JOIN (
                    SELECT PropertyID, AVG(Price) AS AvgPrice
                    FROM FloorPlan
                    GROUP BY PropertyID
                ) AS fp ON f.PropertyID = fp.PropertyID
                SET f.PriceAtFavTime = fp.AvgPrice
                WHERE f.FavoriteID = new_favorite_id;

                COMMIT;
            ELSE
                ROLLBACK;
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Failed to add to favorites: Listing is not available';
            END IF;
        ELSE
            ROLLBACK;
        END IF;
END //
DELIMITER ;
