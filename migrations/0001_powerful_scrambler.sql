CREATE TABLE `transactions` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`amount` int NOT NULL,
	`date` datetime NOT NULL,
	`user_id` int unsigned NOT NULL,
	`place_id` int unsigned NOT NULL,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_favorite_places` (
	`user_id` int unsigned NOT NULL,
	`place_id` int unsigned NOT NULL,
	CONSTRAINT `user_favorite_places_user_id_place_id_pk` PRIMARY KEY(`user_id`,`place_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_place_id_places_id_fk` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorite_places` ADD CONSTRAINT `user_favorite_places_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorite_places` ADD CONSTRAINT `user_favorite_places_place_id_places_id_fk` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE cascade ON UPDATE no action;