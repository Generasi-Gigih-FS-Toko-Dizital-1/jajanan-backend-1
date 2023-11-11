# jajanan-backend-1

## Description
This is a backend for the Jajanan app. This app has 3 roles, namely admin, vendor, and user. The admin can manage all data, the vendor can manage its product, and the customer can order the product.

## Features

### Authentications

#### Admin
- Login
- Logout
- Refresh Token

#### Vendor
- Register
- Login
- Logout
- Refresh Token

#### User
- Register
- Login
- Logout
- Refresh Token

### Managements
- Admin Management
- Category Management
- File Management
- Jajan Item Management
- Jajan Item Snapshot Management
- Payout History Management
- Session Management
- Top-Up Management
- Transaction History Management
- Transaction Item History Management
- User Level Management
- User Management
- User Subscription Management
- Vendor Level Management
- Vendor Management

### Top-Ups
- E-wallet Top-Up
- Webhook Top-Up

### Payouts
- Payout
- Webhook Payout

### Transaction
- Checkout Transaction

### Subscription
- User Subscription

### Location
- Sync Location


## How to Install and Run
1. Clone this repository.
2. Open the terminal and change the directory to the cloned repository.
3. Set up the environment variables according to the configured infrastructure in `docker-compose.yml` file and 3rd party service credentials.
4. Prepare `firebase-admin-key.json` file and put it in the root directory. This file is used for Firebase admin SDK.
5. Run `docker-compose up -d --build` command in the terminal. This command will build and run the docker container.
6. Wait until the build and run process is complete.
7. Try the application from the specified host and port in your HTTP client, i.e. `http://localhost:3000/api/v1`.

## API Documentation
> https://documenter.getpostman.com/view/6165469/2s9YJdUgyn
