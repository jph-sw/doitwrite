# doitwrite

a selhosted note taking app with markdown support

## Getting started

**Self-Hosting doitwrite: A Step-by-Step Guide**

Welcome to doitwrite! This guide will walk you through setting up your own instance of doitwrite using Docker Compose. This allows you to run doitwrite on your own server or computer.

**Prerequisites:**

Before you begin, make sure you have the following installed:

- **Docker:** Docker is a platform for running applications in containers. You can download it from [https://www.docker.com/get-started](https://www.docker.com/get-started). Follow the installation instructions for your operating system.
- **Docker Compose:** Docker Compose is a tool for defining and running multi-container Docker applications. It's often included with Docker Desktop. If you need to install it separately, see the instructions here: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

**Step 1: Create a Project Directory**

First, create a directory on your computer where you'll store the doitwrite configuration files. For example:

```bash
mkdir doitwrite
cd doitwrite
```

**Step 2: Create the `docker-compose.yml` File**

Create a file named `docker-compose.yml` inside the `doitwrite` directory. This file will define how doitwrite and its database are set up.

Open the `docker-compose.yml` file in a text editor and paste the following content:

```yaml
version: "3"
services:
  db:
    image: postgres
    restart: always
    network_mode: "host"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
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
      BETTER_AUTH_SECRET: "YOUR_BETTER_AUTH_SECRET"
      BETTER_AUTH_URL: "http://localhost:3000"
      DISCORD_CLIENT_ID: "YOUR_DISCORD_CLIENT_ID"
      DISCORD_CLIENT_SECRET: "YOUR_DISCORD_CLIENT_SECRET"
      DATABASE_URL: "postgresql://postgres:password@localhost:5432/doitwrite"
    volumes:
      - ./scripts:/scripts

volumes:
  db_data:
```

**Important:**

- **Replace the placeholders:** Carefully replace the following placeholders with your actual values:
  - `YOUR_BETTER_AUTH_SECRET`: Generate a strong, random secret for BETTER_AUTH_SECRET. This is crucial for security.
  - `YOUR_DISCORD_CLIENT_ID`: If you are using Discord authentication, get your Discord Client ID from the Discord Developer Portal.
  - `YOUR_DISCORD_CLIENT_SECRET`: If you are using Discord authentication, get your Discord Client Secret from the Discord Developer Portal.

**Step 3: Create the Startup Script**

Create a directory named `scripts` inside the `doitwrite` directory. Then, create a file named `wait-and-migrate.sh` inside the `scripts` directory.

Open the `wait-and-migrate.sh` file in a text editor and paste the following content:

```bash
#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "."
  sleep 2
done

echo "Database is ready!"

# Run the migrations (ignore errors if tables already exist)
echo "Running database migrations..."
npx @better-auth/cli@latest migrate || true

# Start the application
echo "Starting the application..."
npm start
```

Save the file.

**Step 4: Make the Script Executable**

Open your terminal, navigate to the `doitwrite` directory, and run the following command to make the script executable:

```bash
chmod +x scripts/wait-and-migrate.sh
```

**Step 5: Start doitwrite with Docker Compose**

In your terminal, still in the `doitwrite` directory, run the following command:

```bash
docker-compose up --build -d
```

This command will:

- `--build`: Build the `doitwrite` Docker image (if it's not already built).
- `up`: Start the services defined in your `docker-compose.yml` file.
- `-d`: Run the services in detached mode (in the background).

**Step 6: Access doitwrite**

Once the services are running, you should be able to access doitwrite in your web browser at:

```
http://localhost:3000
```

**Important Notes:**

- **Network Mode:** This setup uses `network_mode: "host"`, which means that doitwrite and the database share the same network namespace as your host machine. This is often the simplest approach for local setups, but it might have security implications in some environments. If you're deploying to a server, consider using Docker's default bridge network or creating a custom network.
- **Data Persistence:** The `volumes` section in the `docker-compose.yml` file ensures that your database data is persisted even if you stop and restart the containers. The named volume `db_data` ensures that your data is persisted safely.
- **Environment Variables:** Make sure you understand the purpose of each environment variable and provide appropriate values.
- **Security:** Protect your `BETTER_AUTH_SECRET`! Keep it secret and don't share it. Consider using a more secure way to manage secrets in production environments.
- **Updates:** To update doitwrite to a newer version, stop the running containers (`docker-compose down`), pull the new image (`docker pull jphsw/doitwrite`), and then start the containers again (`docker-compose up --build -d`).
- **Alternative Ports:** If port 3000 or 5432 are already in use on your system, you can change the port mappings in the `docker-compose.yml` file (e.g., `8080:3000` to map port 3000 inside the container to port 8080 on your host).
- **Migration Errors:** When doitwrite starts for the first time, you might see an error message related to database migrations. This is normal and can be safely ignored. The migrations will run, and doitwrite will work correctly.

**Troubleshooting:**

- **Check the Logs:** If you encounter any problems, check the logs of the containers using `docker-compose logs <service_name>` (e.g., `docker-compose logs doitwrite`, `docker-compose logs db`).
- **Database Connection Errors:** Make sure the database is running and accessible from the `doitwrite` container. Double-check the `DATABASE_URL` in your `docker-compose.yml` file.

Enjoy using your self-hosted doitwrite instance!
