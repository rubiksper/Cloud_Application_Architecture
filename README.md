Setting Up MySQL Database with phpMyAdmin
Prerequisites

    Ensure that you have MySQL installed 
    Access to phpMyAdmin.

Steps

    Access phpMyAdmin: Open your web browser and navigate to phpMyAdmin by entering the URL provided by your hosting provider, typically in the format http://your_domain/phpmyadmin.

    Log in: Log in to phpMyAdmin using your MySQL username and password.

    Create a New Database:
        Click on the "Databases" tab.
        Enter the desired name "praha-gem" in the "Create database" field.
        Choose the appropriate collation from the dropdown menu (usually utf8_general_ci).
        Click on the "Create" button to create the database.

    Create Tables:
        After creating the database, click on its name in the left sidebar to select it.
        Navigate to the "SQL" tab.
        Copy the SQL schema provided below and paste it into the SQL query box.
        Click on the "Go" button to execute the query and create the necessary tables.


CREATE TABLE IF NOT EXISTS `gem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(255) NOT NULL,
  `Adresse` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `contributeur` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `location_proposal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(255) NOT NULL,
  `Adresse` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




go to your user table in your database and then insert sql request:

INSERT INTO users (name, email, password, role) 
VALUES ('Admin Name', 'admin@example.com', 'motdepasse', 'admin');

to have an admin account


    Configuration:
        Update your server-side code (server.js) with the appropriate MySQL connection details, including your host, username, password, and database name.


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'your_database_name'
});

and also:

// Add an event listener for the gem table
instance.addTrigger({
  name: 'monitor_gem_table',
  expression: 'your_database_name',
  statement: MySQLEvents.STATEMENTS.ALL,
  onEvent: (event) => {
    if (event.type === 'insert' || event.type === 'update' || event.type === 'delete') {
      console.log('Changes detected in gem table. Restarting server...');
    }
  },
});

    Start Your Server: After setting up the database, start your Node.js server to establish a connection with the MySQL database and run your application.
    And you can add gem.json data on it by running the server.
