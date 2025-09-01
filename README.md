# Restaurant-MongoDB
A secure and scalable Node.js backend for a restaurant management system, built with Express, Mongoose, Multer, and JWT authentication.  This project enables restaurant owners to easily manage their menus while allowing customers to explore restaurants and filter menus by category.

🚀 Features

🔐 Authentication & Authorization

1) Secure user registration and login with JSON Web Tokens (JWT).

2) Passwords securely stored using hashing.

👤 User Management

1) Register new restaurant accounts with business details.

2) View all registered restaurants on the Users page.

📋 Menu Management

1) Full CRUD operations for menus (Create, Read, Update, Delete).

2) Menu items include name, category, price, and image (image uploads handled via Multer).

🏠 Homepage (Users Page)

1) Displays all restaurant users with their business name.

2) Clicking on a user reveals their menu and restaurant details.

3) Category filters for quick menu navigation.

🛡️ Security & Best Practices

1) JWT-secured API endpoints.

2) Input validation with Mongoose.

3) Protected routes for authenticated users only.

🛠️ Tech Stack

1) Backend: Node.js, Express.js

2) Database: MongoDB (Mongoose ODM)

3) Authentication: JSON Web Token (JWT)

4) File Uploads: Multer

5) API Design: RESTful architecture

📌 Pages Implemented

1) Register → Create an account for your restaurant

2) Login → Secure login with JWT

3) Menu → Manage your restaurant’s menu (CRUD)

4) Users (Home-page) → View all restaurants with their business details

5)FoodMenu → Explore menus with category-based filtering

🎯 Purpose

This project provides a solid backend foundation for restaurant platforms, food ordering apps, or multi-restaurant systems.
It demonstrates secure authentication, media handling, and structured API development for real-world applications.
