#!/bin/bash

PATH="C:\Users\SERGIO VARGAS\Documents\DevelopeR-Practics\VM-Practice"
echo "$PATH"

git clone https://github.com/svargasc/VM-Store.git $PATH
cd "$PATH\VM-Store"
git checkout master 

cd ..
git clone https://github.com/svargasc/VM-Store.git $PATH
cd "$PATH\VM-Store"
git checkout master