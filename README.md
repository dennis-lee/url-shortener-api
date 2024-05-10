# url-shortener-api

Backend API for a URL shortening service. Creates a 7-character unique ID as the URL alias. Current production setup is a Docker container running on an EC2 instance.

## Local development

Minimum requirements:

- Node.js v20.12.2
- Docker

### Setup

1. Rename `.env.example` to `.env`
2. `npm i`
3. `docker compose up mongodb`
4. `npm run dev`

## Teardown

1. `docker compose down --remove-orphans -v`
