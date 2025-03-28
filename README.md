# doitwrite

a selhosted note taking app with markdown support

## Getting started

**Self-Hosting doitwrite: A Step-by-Step Guide**

Welcome to doitwrite! This guide will walk you through setting up your own instance of doitwrite using Docker Compose. This allows you to run doitwrite on your own server or computer.

**Docker Compose**

```yaml
services:
  db:
    image: postgres
    restart: always
    network_mode: "host"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password # change this to a secure password
      POSTGRES_DB: doitwrite
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  doitwrite:
    image: jphsw/doitwrite
    network_mode: "host"
    depends_on:
      - db
    environment:
      BETTER_AUTH_SECRET: "your_secret_here"
      BETTER_AUTH_URL: "http://localhost:3000" # this should be the URL of your doitwrite instance
      DISCORD_CLIENT_ID: "your-discord-client-id"
      DISCORD_CLIENT_SECRET: "your-discord-client-secret"
      DATABASE_URL: "postgresql://postgres:password@localhost:5432/doitwrite" # change the password to the one you set for the database

volumes:
  db_data:
```
