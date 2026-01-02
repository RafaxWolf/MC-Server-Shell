#!/bin/bash

#Colours
greenColour="\e[0;32m\033[1m"
endColour="\033[0m\e[0m"
redColour="\e[0;31m\033[1m"
blueColour="\e[0;34m\033[1m"
yellowColour="\e[0;33m\033[1m"
purpleColour="\e[0;35m\033[1m"
turquoiseColour="\e[0;36m\033[1m"
grayColour="\e[0;37m\033[1m"

trap ctrl_c INT

function ctrl_c() {
    echo -e "\n\n${redColour}[!] Exiting...${endColour}\n"
    exit 0
}

function banner() {
    echo -e "${greenColour}${endColour}"
    sleep 0.05

}

function check_dependencies() {
    if [ "$(command -v pnpm)" ]; then
        echo -e "${greenColour}[+] pnpm is installed.${endColour}"
    else
        echo -e "${redColour}[-] pnpm is not installed!${endColour}\n${blueColour}Please install pnpm to continue.${endColour}"
        exit 1
    fi
}

# ================= Script Code ================== #
# Shell Folder
check_dependencies
echo -e "${greenColour}[+] Server Shell started successfully!${endColour}\n"
pnpm start
