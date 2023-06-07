#!/bin/bash

PATH="C:\Users\SERGIO VARGAS\Documents\DevelopeR-Practics\VM-Practice"
echo "$PATH"

git clone https://github.com/svargasc/VM-Practice.git $PATH
cd "$PATH\VM-Practice"
git checkout master 

cd ..
git clone https://github.com/svargasc/VM-Practice.git $PATH
cd "$PATH\VM-Practice"
git checkout master