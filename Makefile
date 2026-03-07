.PHONY: serve build install

install:
	npm install

serve:
	hugo server -D

build:
	npm run build

default: serve
