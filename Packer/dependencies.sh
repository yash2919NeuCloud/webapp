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

#install google cloud agent
sudo curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
# new_content=$(cat <<EOF
# logging:
#   receivers:
#     my-app-receiver:
#       type: files
#       include_paths:
#         - /tmp/myapp.log
#       record_log_file_path: true
#   processors:
#     my-app-processor:
#       type: parse_json
#       time_key: time
#       time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"
#   service:
#     pipelines:
#       default_pipeline:
#         receivers: [my-app-receiver]
#         processors: [my-app-processor]
# EOF
# )

# # Write the new content to the config file using sed
# sudo sed -i '1,/^logging:/{/^logging:/r /dev/stdin' -e 'd}' /etc/google-cloud-ops-agent/config.yaml <<<"$new_content"


sudo tee /etc/google-cloud-ops-agent/config.yaml > /dev/null << EOF
logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /tmp/myapp.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor]
EOF

sudo systemctl restart google-cloud-ops-agent
