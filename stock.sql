DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS accounts;


CREATE TABLE IF NOT EXISTS `accounts` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(30),
  `pass` varchar(100)
);

CREATE TABLE IF NOT EXISTS `stock` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `productBarcode` int,
  `productName` varchar(40),
  `productPhoto` varchar(40),
  `wholesalePrice` int,
  `retailPrice` int,
  `quantity` int,
  `stockLevel` varchar(10),
  `userid` mediumint UNSIGNED,
  `username` varchar(30)
);



CREATE TABLE IF NOT EXISTS `orders` (
  `id` MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `itemId` MEDIUMINT UNSIGNED NOT NULL,
  `quantity` MEDIUMINT UNSIGNED NOT NULL,
  `receivedStatusYN` BOOLEAN
);

ALTER TABLE `stock` ADD FOREIGN KEY (`userid`) REFERENCES `accounts` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`itemId`) REFERENCES `stock` (`id`);


INSERT INTO accounts(user, pass)
	VALUES("admin", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO");
INSERT INTO accounts(user, pass)
	VALUES("employee1", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO");
INSERT INTO accounts(user, pass)	
	VALUES("employee2", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO");
INSERT INTO accounts(user, pass)
	VALUES("branch2", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO");

INSERT INTO stock(productBarcode, productName, productPhoto, wholesalePrice, retailPrice, quantity, stockLevel, userid, username)
  VALUES(88888888, "RAM", "/uploads/generic.jpg", 8, 14, 55, "High", 1, "admin");
INSERT INTO stock(productBarcode, productName, productPhoto, wholesalePrice, retailPrice, quantity, stockLevel, userid, username)
  VALUES(88888888, "555 Timer", "/uploads/555_microcontroller", 2, 4, 3, "Low", 2, "admin");