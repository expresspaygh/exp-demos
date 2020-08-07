## logs: Tail general logs for all running docker compose containers
logs:
	docker-compose logs -f

## down: Shutdown docker compose running containers
down:
	docker-compose down

## clean: Clean up after shutdown and remove all dummy images and volumes
clean:
	docker system prune -f
	docker volume prune -f

## run: Boot up docker compose containers in daemon mode
run:
	docker-compose up -d

## run-dev: Boot up docker compose containers in developer mode
run-dev:
	docker-compose up

## run-build: Boot up docker compose containers and build
run-build:
	docker-compose up --build

## ssh-nginx: SSH into container for the webserver
ssh-nginx:
	docker-compose exec webserver bash

## ssh-app: SSH into container for the app
ssh-app:
	docker-compose exec app bash

## view: Show all running containers for the app
view:
	docker-compose ps

## own: Own api log file
own:
	sudo chown www-data:$USER api/api.log

## help: Command to view help
help: Makefile
	@echo
	@echo "Choose a command to run:"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo