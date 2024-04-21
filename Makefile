# Detect the operating system
OS := $(shell uname)

# Set Docker Compose command based on the operating system
ifeq ($(OS),Linux)
	DOCKER_COMPOSE = sudo docker-compose
else
	DOCKER_COMPOSE = docker compose
endif

# Targets
.PHONY: build exec up down seeder refresh log restart

# Build the Docker containers
build:
	$(DOCKER_COMPOSE) build

# Execute a bash shell inside the app container (non-sudo)
exec:
	$(DOCKER_COMPOSE) exec app sh

# Bring up the Docker containers (non-sudo)
up:
	$(DOCKER_COMPOSE) up

# Bring down the Docker containers (non-sudo)
down:
	$(DOCKER_COMPOSE) down

# Run database seeders (non-sudo)
seeder:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:seed:all"

# Refresh the environment by bringing down and then up the Docker containers (non-sudo)
refresh: down up

#Restart app
restart: 
	$(DOCKER_COMPOSE) restart app
#Start app
start: 
	$(DOCKER_COMPOSE) start app
#Stop app
stop: 
	$(DOCKER_COMPOSE) stop app
create-database:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:create"
#Running migration
migration:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:migrate"
#Undo the most recent migration
migration-undo:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:migrate:undo"
#Undo all migration
migration-undo-all:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:migrate:undo:all"
# Rule to generate a new seed file
#Example : make generate-seed NAME=name-seed
generate-seed:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli seed:generate --name $(NAME)"
# Rule to generate a new migration file
generate-migration:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli migration:generate --name $(NAME)"
fix:
	$(DOCKER_COMPOSE) exec app sh -c "npm install" && \
	$(DOCKER_COMPOSE) restart app
migration-refresh:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:migrate:undo" && \
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:migrate"
#Undo all seed
seeder-undo:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:seed:undo:all"
#Refresh seeder
seeder-refresh:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:seed:undo:all" && \
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:seed:all"
# Run one seed
run-seeder:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:seed --seed $(NAME)"