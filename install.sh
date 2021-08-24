#!/bin/sh

CheckIP() {
  echo $1 | grep -E "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]).){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$" >/dev/null
  if [ $? = 1 ]; then
    echo "Invalid IP address, please input again"
    return 1
  fi

  return 0
}

function confirmValue() {
  while [ 1 ]; do
    echo "$1"
    read line
    if [ $line ]; then
      echo "line:::$line"
      eval $2="'$line'"
      break
    fi
  done
}

echo "uninstall old tems-webserver..."

install_directory=/usr/local/tems/webserver
rm -rf $install_directory

echo "copy install files..."
mkdir $install_directory

cp -rf * $install_directory/
cd $install_directory

if [ ! $temsServerHost ]; then
  confirmValue "please input tems server host" temsServerHost
  succeed=0
  until [ $succeed -eq 1 ]; do
    CheckIP $temsServerHost
    if [ $? = 0 ]; then
      succeed=1
    else
      read $temsServerHost
    fi
  done
  echo $temsServerHost
fi

awk '{ gsub(/[$][$]temsServerHost/,temsServerHost); print $0 }' temsServerHost="${temsServerHost}" ./configuration/configuration.json.tmpl >./configuration/configuration.json

systemctl stop TEMSWebServer.service
cp TEMSWebServer.service /etc/systemd/system/
echo "disable tems webserver service"
systemctl disable TEMSWebServer.service
echo "enable tems webserver service"
systemctl enable TEMSWebServer.service
echo "start tems webserver service"
systemctl start TEMSWebServer.service
