CREATE TABLE
    user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(256),
        surname VARCHAR(256),
        birthday VARCHAR(256),
        phone INTEGER 
        email VARCHAR(512) UNIQUE,
        password VARCHAR(50),
        is_verified BOOLEAN DEFAULT 'false',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        verificationId VARCHAR(256) role ENUM (
            'User',
            'Admin',
            'NOT_VERIFIED'
        ) DEFAULT 'NOT_VERIFIED',
    )
    