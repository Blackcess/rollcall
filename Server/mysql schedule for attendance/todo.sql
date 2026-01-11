SET GLOBAL event_scheduler = ON;


CREATE EVENT generate_daily_lectures
ON SCHEDULE EVERY 1 DAY
STARTS '2025-08-16 00:00:00'
DO
INSERT INTO daily_lectures (course_id, date, start_time, end_time)
SELECT course_id, CURDATE(), start_time, end_time
FROM fifth_sem_timetable
WHERE day_of_week = DAYNAME(CURDATE());