

read_conf = $(shell sed '/"$(1)":/!d;s///;s/[ ,"]//g' package.json)
wc        = $(shell wc -c <"$(1)")


define COMPILE
	# Call Google Closure Compiler: $(1) -> $(2)
	@curl -s \
		    --data-urlencode 'output_info=compiled_code' \
				--data-urlencode 'output_format=text' \
				--data-urlencode 'js_code@$(1)' \
				'http://closure-compiler.appspot.com/compile' > $(2)
	@echo "# Compiled from $$(wc -c <"$(1)") to $$(wc -c <"$(2)") bytes"
endef

define TOGGLE
	# Toggle comments '$(1)' and save to $(2)
	@sed -E -e 's,//\*\* ($(1)),/* $(1),' $(FILE) > $(2)
endef


NAME=$(call read_conf,name)
FILE=$(call read_conf,main)
MIN=$(FILE:.js=.min.js)
VERSION=$(call read_conf,version)

SETUPS = mvc.min.js

.PHONY: test

all: update-version $(MIN) $(SETUPS) test update-readme


%.min.js: %.js
	# Build $@ from $*.js
	$(call COMPILE,$*.js,$@)



update-readme: SIZE=$(shell cat $(MIN) | wc -c)
update-readme: SIZE_GZ=$(shell gzip -c $(MIN) | wc -c)
update-readme:
	@printf "Original Size %s Compiled Size %s or %s gzipped\n" \
	        "$$(cat $(FILE) | wc -c) bytes" \
	        "$(SIZE) bytes" \
	        "$(SIZE_GZ) bytes"
	@sed -i '/ bytes, .* gzipped/s/.*/($(SIZE) bytes, $(SIZE_GZ) bytes gzipped)/' README.md

update-readme-from-source:
	@sed -e '/\/\*/,/\*\//!d' -e 's,[ /]*\*[ /]\?,,' -e 's/^@/    @/' $(FILE) > README.md

update-version:
	@sed -i '/@version/s/[^ ]*$$/$(VERSION)/' $(FILE)

update-tests:
	@printf "$$(cat test/html.tpl)" "$$(for file in test/*.liquid; do printf '\n\n\n<script type="text/liquid">\n%s\n</script>' "$$(cat $$file)"; done)" > test/test.html

css-docs:
	@styledocco -n "$(NAME)" css

error:
	@curl -s \
		    --data-urlencode 'output_info=errors' \
				--data-urlencode 'output_format=text' \
				--data-urlencode 'js_code@$(FILE)' \
				'http://closure-compiler.appspot.com/compile'

test:
	@node test/run.js


print: *.js
	@echo $?
	touch print

