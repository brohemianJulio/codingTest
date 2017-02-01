# codingTest

## Requirements
* npm v3.x.x or higher
* node v4.x.x or higher
* Verify by running the commands node -v and npm -v in a terminal/console window.

## Build Instructions
* git clone https://github.com/brohemianJulio/codingTest
* npm install
* npm start
* A browser should pop-up otherwise browse to: http://localhost:3000/

## Code Review Information
* Project uses Angular2
* The most relevant files with code are:
    * app.component.ts - Most logic found here
    * transactions.service.ts - API call code found here


## Project Overview
* As soon as the page loads, transactions from the GetAllTransactions endpoint are retrieved
* Data from GetAllTransactions endpoint is processed and displayed as requested
* Optionally, can display data that excludes donut transactions
* Optionally, can display data that includes crystal ball data retrieved from GetProjectedTransactionsForMonth endpoint
* Optionally, can display data that excludes CreditCard transactions and shows those excluded transactions


## Final notes
* Author: Julio Davalos
* Thanks
