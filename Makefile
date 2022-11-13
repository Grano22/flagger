# ==== Env ====
DOCKER_RUNTIME := $(shell which docker)
APP_TEST_IMAGE_VERSION := latest

# ==== Targets ====
.PHONY: build-test-app #@app build test image
build-test-app:
	DOCKER_BUILDKIT=1 "$(DOCKER_RUNTIME)" build -t "feature-flagger-test:$(APP_TEST_IMAGE_VERSION)" -f .docker/app/Dockerfile --target test-app .

.PHONY: test-app #@app test
test-app:
	$(DOCKER_RUNTIME) run --rm -it --name feature-flagger-test \
	-v "$(PWD)/src/:/var/www/app/src" \
	-v "$(PWD)/tests/:/var/www/app/tests" \
	"feature-flagger-test:$(APP_TEST_IMAGE_VERSION)"
