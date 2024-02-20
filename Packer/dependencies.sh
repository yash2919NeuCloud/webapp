#!/bin/bash

sudo dnf update



# Install NodeJS
sudo dnf module enable nodejs:16 -y
sudo dnf install nodejs -y

node --version

sudo yum install -y @mysql

# # Start the MySQL service
sudo systemctl start mysqld

# # Enable MySQL to start on boot
sudo systemctl enable mysqld

mysql -u root -e "ALTER USER 'root '@'localhost' IDENTIFIED BY 'Yashnahta291*';" -e "CREATE DATABASE IF NOT EXISTS database1;"

# Setup and start application

sudo yum install -y unzip

# unzip usr/bin/home/centos/Yash_Nahata_002207385_03.zip -d /home/centos/cd home/centos/Yash_Nahata_002207385_03 
# cd usr/bin/home/centos
echo "Current directory: $(pwd)"
unzip webapp.zip

#create ENV file
echo "DB_HOST=localhost" | sudo tee /home/centos/webapp/.env
echo "DB_USER=root" | sudo tee -a /home/centos/webapp/.env
echo "DB_PASSWORD=Yashnahta291*" | sudo tee -a /home/centos/webapp/.env
echo "DB_DATABASE=database1" | sudo tee -a /home/centos/webapp/.env

cd Yash_Nahata_002207385_04/webapp

npm i
cd ..
cd ..
ls

sudo chcon -t systemd_unit_file_t /home/centos/webapp/.env
# Add user and group
sudo groupadd csye6225
sudo useradd -M -g csye6225 -s /usr/sbin/nologin csye6225
sudo chown -R csye6225:csye6225 /home/centos
sudo chmod -R 750  /home/centos


sudo cp app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable app.service
sudo systemctl start app.service
sudo systemctl status app.service
# journalctl -xe | grep app
