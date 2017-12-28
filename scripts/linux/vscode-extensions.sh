#!/bin/sh
path="../../logs/"
user=$(whoami)
logDate=$(date +'%Y-%m-%d')
file="vscode-extentions.log"

echo "You can find a list of vscode extionsions at $path$file"
echo "================================" >> $path$file
echo "User: $user" >> $path$file
echo "Date: $logDate" >> $path$file
echo "================================" >> $path$file
code --list-extensions >> $path$file
echo "--------------------------------" >> $path$file
echo "" >> $path$file
