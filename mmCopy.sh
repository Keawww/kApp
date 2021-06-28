#!/bin/zsh
# /<
# 21.06a

name=Tasks
source=/Users/admin/Downloads/
dest=/Users/admin/Documents/Apps/kApp-v7/front/src/components/kmm/

#find ${source}${name}* -cmin -20 -ls

last=`ls -t ${source}${name}* | head -1`
echo cp ${last} ${} to ${name}.json
cp ${last} ${} ${dest}${name}.json