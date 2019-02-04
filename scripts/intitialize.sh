#!/bin/bash

# Install build tools
sudo yum groupinstall -y "Developer Tools"
sudo yum install -y gcc-c++ make

# Install NodeJS and yarn
sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -
sudo curl -sL https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo

sudo yum install nodejs yarn

# Install MongoDB
cat >/etc/yum.repos.d/mongodb-org-4.0.repo<<EOF
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
EOF

sudo yum install -y mongodb-org