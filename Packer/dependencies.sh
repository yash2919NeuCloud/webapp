#!/bin/bash

sudo dnf update

# Install NodeJS
sudo dnf module enable nodejs:16 -y
sudo dnf install nodejs -y

# sudo yum install -y @mysql

# # # Start the MySQL service
# sudo systemctl start mysqld

# # # Enable MySQL to start on boot
# sudo systemctl enable mysqld

# mysql -u root -e "ALTER USER 'root '@'localhost' IDENTIFIED BY 'Yashnahta291*';" -e "CREATE DATABASE IF NOT EXISTS database1;"

# Setup and start application

sudo yum install -y unzip

# unzip usr/bin/home/centos/Yash_Nahata_002207385_03.zip -d /home/centos/cd home/centos/Yash_Nahata_002207385_03 
# cd usr/bin/home/centos
echo "Current directory: $(pwd)"
sudo unzip webapp.zip 
pwd
#create ENV file
# Define your environment variables

# DB_HOST="localhost"
# DB_USER="root"
# DB_PASSWORD="Yashnahta291*"
# DB_DATABASE="database1"

# # Create or overwrite the .env file
# sudo cat > .env << EOF
# DB_HOST=$DB_HOST
# DB_USER=$DB_USER
# DB_PASSWORD=$DB_PASSWORD
# DB_DATABASE=$DB_DATABASE
# EOF

# echo ".env file created successfully."

sudo npm i

# sudo chcon -t systemd_unit_file_t /home/centos/.env
# Add user and group
sudo groupadd csye6225
sudo useradd -M -g csye6225 -s /usr/sbin/nologin csye6225
sudo chown -R csye6225:csye6225 /home
sudo chmod -R 750  /home


sudo cp app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable app.service
sudo systemctl start app.service
sudo systemctl status app.service
# journalctl -xe | grep app
