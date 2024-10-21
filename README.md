# KIB Task

A NestJS-based project for managing TMDB movie-related services.

## Table of Contents

- [Installation](#installation)
- [Running the App](#running-the-app)
- [Running in Docker](#running-in-docker)
- [Testing](#testing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abdulrahman402/KIB-Task.git
   cd KIB-Task

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Create a .env file based on the provided .env.example file:

   ```bash
   cp .env.example .env

   ```

4. Update the .env file with your credentials:
   - Set up your MongoDB connection.
   - Add your TMDB API token.
   - Add your TMDB API URL.

## Running the App

    npm run start:dev

## Running in Docker

    - Ensure Docker is installed.
    docker-compose up --build

## Testing

    npm run test

## Swagger Documentation

    http://localhost:8080/api-docs
