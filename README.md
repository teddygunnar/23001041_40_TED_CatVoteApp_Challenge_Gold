# Disclaimer

This GitHub Repository is solely for submitting the gold challenge in BINAR Bootcamp Wave 40. Any claims regarding the assets, content, or any other elements of this repository are purely coincidental.

# Getting Started

To run this project locally, follow these steps:

## Prerequisites

Make sure you have Node.js and PostgreSQL installed. You can download them from the [Official Node.js](https://nodejs.org/) and [Official Postgre](https://www.postgresql.org/download/).

## Installation

- Clone the repository to your local machine.
- Navigate to your directory
- Open server/knexfile.js and Configure your database connection details.
- Install Knex Globally `npm install -g knex` and then install project depedencies `npm install` or `yarn install`
- Execute the following command to apply database migrations and it's initial data, `knex migrate:latest` and `knex seed:run`
- Finally start your application `npm start` or `yarn start`

# About

This app allows users to choose their favorite cats. You have the flexibility to select multiple cats, but each cat can only be liked once. The data is seamlessly updated in real-time using WebSocket, providing an interactive and engaging experience.

## Features

- **Cat Selection:** Choose your favorite cats from a variety of options.
- **One Like per Cat:** You can like multiple cats, but each cat can only be liked once.
- **Real-time Data:** The app ensures real-time updates, providing a dynamic and responsive user experience.
