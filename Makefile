COMPOSE_DEV := docker compose --env-file apps/backend/.env -f docker-compose.dev.yaml

.PHONY: db-up db-down db-logs db-status db-shell db-reset

db-up:
	$(COMPOSE_DEV) up -d db

db-down:
	$(COMPOSE_DEV) down

db-logs:
	$(COMPOSE_DEV) logs -f db

db-status:
	$(COMPOSE_DEV) ps db

db-shell:
	$(COMPOSE_DEV) exec db mysql -u root -p techbite

db-reset:
	$(COMPOSE_DEV) down -v
	$(COMPOSE_DEV) up -d db
