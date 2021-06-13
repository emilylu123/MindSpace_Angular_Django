CREATE DATABASE app;
CREATE USER 'mysql'@'%' IDENTIFIED BY 'secret';
CREATE USER 'mysql'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL ON app.* TO 'mysql'@'%';
GRANT ALL ON app.* TO 'mysql'@'localhost';
USE app;