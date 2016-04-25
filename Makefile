PASS=$(shell echo $$LAURADOCKERPASSWORD)

clean: 
	docker rmi laurafitz/activitytest; docker rmi laurafitz/activity

build-test:
	docker build -f Dockerfile-test -t laurafitz/activitytest .

test: build-test
	docker run --rm -v $(shell pwd)/src:/activity laurafitz/activitytest

build:
	docker build -t laurafitz/activity .

release: build
	docker push laurafitz/activity
	