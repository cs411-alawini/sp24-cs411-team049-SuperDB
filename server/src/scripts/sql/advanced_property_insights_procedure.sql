DELIMITER //
DROP PROCEDURE IF EXISTS AdvancedPropertyInsights;

CREATE PROCEDURE AdvancedPropertyInsights(IN userID INT, IN minLat DECIMAL(9,6), IN maxLat DECIMAL(9,6), IN minLon DECIMAL(9,6), IN maxLon DECIMAL(9,6))
BEGIN
   DECLARE finished INT DEFAULT 0;
   DECLARE propID BIGINT;
   DECLARE percentile25 INT DEFAULT 0;
   DECLARE percentile50 INT DEFAULT 0;
   DECLARE percentile75 INT DEFAULT 0;
   DECLARE cur CURSOR FOR SELECT PropertyID FROM FavoriteAnalysis WHERE PropertyID NOT IN (SELECT PropertyID FROM Favorites fa WHERE fa.UserID = userID);
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

   DROP TABLE IF EXISTS FavoriteAnalysis;
   DROP TABLE IF EXISTS RatingAnalysis;
   DROP TABLE IF EXISTS CombinedInsights;

   CREATE TABLE FavoriteAnalysis (
       PropertyID BIGINT,
       FavoriteCount INT
   );

   CREATE TABLE RatingAnalysis (
       PropertyID BIGINT,
       AvgRating DECIMAL(10,2)
   );

   CREATE TABLE CombinedInsights (
       PropertyID BIGINT,
       FavoriteCount INT,
       AvgRating DECIMAL(10,2),
       Insight VARCHAR(255),
       PropertyName VARCHAR(255),
       Description TEXT
   );

   INSERT INTO FavoriteAnalysis (PropertyID, FavoriteCount)
   SELECT p.PropertyID, COUNT(f.PropertyID) AS FavoriteCount
   FROM Property p
   LEFT JOIN Favorites f ON p.PropertyID = f.PropertyID AND f.UserID != userID
   WHERE p.Latitude BETWEEN minLat AND maxLat AND p.Longitude BETWEEN minLon AND maxLon
   GROUP BY p.PropertyID;


   INSERT INTO RatingAnalysis (PropertyID, AvgRating)
   SELECT PropertyID, AVG(Score) AS AvgRating
   FROM Rating
   WHERE PropertyID IN (SELECT PropertyID FROM Property WHERE Latitude BETWEEN minLat AND maxLat AND Longitude BETWEEN minLon AND maxLon)
   GROUP BY PropertyID;


   SELECT FLOOR(0.25 * COUNT(*) + 1) INTO percentile25 FROM FavoriteAnalysis;
   SELECT FLOOR(0.50 * COUNT(*) + 1) INTO percentile50 FROM FavoriteAnalysis;
   SELECT FLOOR(0.75 * COUNT(*) + 1) INTO percentile75 FROM FavoriteAnalysis;

   OPEN cur;

   insights_loop: LOOP
       FETCH cur INTO propID;
       IF finished = 1 THEN
           LEAVE insights_loop;
       END IF;


       INSERT INTO CombinedInsights (PropertyID, FavoriteCount, AvgRating, Insight, PropertyName, Description)
       SELECT
           f.PropertyID,
           f.FavoriteCount,
           r.AvgRating,
           CASE
                WHEN r.AvgRating >= 4 AND f.FavoriteCount >= percentile75 THEN 'Highly recommended'
                WHEN r.AvgRating >= 3.5 AND f.FavoriteCount >= percentile75 THEN 'Popular'
                WHEN r.AvgRating >= 3.5 AND f.FavoriteCount >= percentile50 AND f.FavoriteCount < percentile75 THEN 'Well-Liked'
                WHEN r.AvgRating >= 3 AND f.FavoriteCount >= percentile25 AND f.FavoriteCount < percentile50 THEN 'Satisfactory'
                WHEN r.AvgRating < 3 AND f.FavoriteCount >= percentile75 THEN 'Cult Favorites'
                WHEN r.AvgRating < 3 THEN 'Needs review'
                ELSE 'Moderately popular'
           END AS Insight,
           p.Title AS PropertyName,
           p.Description
       FROM FavoriteAnalysis f
       JOIN RatingAnalysis r ON f.PropertyID = r.PropertyID
       JOIN Property p ON p.PropertyID = f.PropertyID
       WHERE f.PropertyID = propID;

   END LOOP;

   CLOSE cur;

   SELECT * FROM CombinedInsights
   ORDER BY FavoriteCount DESC, AvgRating DESC
   LIMIT 1;

   DROP TABLE IF EXISTS FavoriteAnalysis;
   DROP TABLE IF EXISTS RatingAnalysis;
   DROP TABLE IF EXISTS CombinedInsights;
END //
DELIMITER ;