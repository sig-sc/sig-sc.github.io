#!/bin/bash

echo "# Generating past seminars as post files"
perl parse_seminar_list.pl  seminar_list_20180613.html
mv _posts/* ../_posts/

echo "# Completed."


