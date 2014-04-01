test:
	@./node_modules/.bin/mocha -R spec

database:
	node tasks/makeDatabase.js

.PHONY: test