PASS=$(shell echo $$LAURADOCKERPASSWORD)

clean: 
	docker rmi fyp/activitytest; docker rmi fyp/activity

build-test:
	docker build -f Dockerfile-test -t fyp/activitytest .

test: build-test
	docker run --rm -v $(shell pwd)/src:/activity fyp/activitytest

build:
	docker build -t fyp/activity .

release: build
	docker login -e laurafitzgeraldsemail@gmail.com -u laura -p $(PASS)  
	docker-laura.ammeon.com:80 && docker tag -f fyp/activity 
	docker-laura.ammeon.com:80/fyp/activity && docker push docker-laura.ammeon.com:80/fyp/activity
