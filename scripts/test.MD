#安装 docker


1. yum update

2. touch /etc/yum.repos.d/docker.repo

[dockerrepo]
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg

3. yum install docker-engine

## 安装 prometheus


docker run -d -p 9090:9090 --name ptu2 prom/prometheus
docker run -d -p 9000:9000 --name jenkins jenkins
docker run -d -p 80:80 --name nginx  -v "/opt/nginx/conf/:/etc/nginx/" -v "/opt/nginx/html/:/usr/share/nginx/html" nginx
docker run -d -p 80:80 --name nginx  -v "/opt/nginx/conf/nginx.conf:/etc/nginx/nginx.conf" -v "/opt/nginx/html/:/usr/share/nginx/html" nginx

docker run -d \
  -p 9090:9090 \
  --name pt2 \
  -v /opt/prometheus:/run: \
  prom/prometheus \
  -config.file=/run/prometheus.yml

#prometheus.yml
global:
  scrape_interval:     15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']
        labels:
          instance: prometheus

  - job_name: linux
    static_configs:
      - targets: ['192.168.8.192:9090']
        labels:
          instance: prometheus


## 服务器监控
docker run -d \
  -p 9100:9100 \
  --name node-exporter \
  -v "/proc:/host/proc" \
  -v "/sys:/host/sys" \
  -v "/:/rootfs" \
  --net="host" \
  quay.io/prometheus/node-exporter \
    -collector.procfs /host/proc \
    -collector.sysfs /host/sys \
    -collector.filesystem.ignored-mount-points "^/(sys|proc|dev|host|etc)($|/)"


docker run -d -p 9100:9100 \
  --name node \
  -v "/proc:/host/proc:ro" \
  -v "/sys:/host/sys:ro" \
  -v "/:/rootfs:ro" \
  --net="host" \
  quay.io/prometheus/node-exporter \
    --collector.procfs /host/proc \
    --collector.sysfs /host/sys \
    --collector.filesystem.ignored-mount-points "^/(sys|proc|dev|host|etc)($|/)"

#grafana


docker run -d -p 3002:3000 \
    --name gf \
     -v "/opt/grafana:/usr/share/grafana" \
    -v "/opt/grafana/conf:/etc/grafana" \
    grafana/grafana


docker run -d -p 3002:3000 \
    --name grafana \
    -v "/opt/grafana/conf:/etc/grafana" \
    grafana/grafana

docker run -d -p 3001:3000 \
    --name grafana \
    -v "/opt/grafana:/usr/share/grafana" \
    -v "/opt/grafana/conf:/etc/grafana" \
    -v /var/lib/grafana:/var/lib/grafana \
    -v "/opt/grafana/log:/var/log/grafana" \
    -v "/opt/grafana/plugins:/var/lib/grafana/plugins" \
    grafana/grafana


docker run -d -p 3001:3000 \
    --name grafana \
    -v "/var/lib/grafana:/var/lib/grafana" \
    grafana/grafana

    ## 安装 zabbix 插件
    docer exec -it id /bin/bash
    grafana-cli plugins install alexanderzobnin-zabbix-app

##数据库监控

#安装mysql
docker pull mysql:5.7
docker run --name db001 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7

#安装zabbix 服务端
docker pull zabbix-server-mysql
docker run --name zabbix-server-mysql  -p 10051:10051 --net=host -e DB_SERVER_HOST="10.15.15.60" -e DB_SERVER_PORT=3306 -e MYSQL_USER="root" -e MYSQL_PASSWORD="123456" -d zabbix/zabbix-server-mysql

#安装zabbix web监控
docker pull zabbix/zabbix-web-apache-mysql
docker run --name zabbix-web-apache-mysql -p 8088:80  -e DB_SERVER_HOST="10.15.15.60" -e DB_SERVER_PORT=3306 -e MYSQL_USER="root" -e MYSQL_PASSWORD="123456" -e ZBX_SERVER_HOST="10.15.15.60" -e TZ="Asia/Shanghai" -d zabbix/zabbix-web-apache-mysql

#安装zabbix 客户端代理
docker pull zabbix/zabbix-agent
docker run --name zabbix-agent -p 10050:10050 -e ZBX_HOSTNAME="15.60" -e ZBX_SERVER_HOST="10.15.15.60" -e ZBX_SERVER_PORT=10051 -d zabbix/zabbix-agent

Admin/zabbix

CREATE USER 'mysql_monitor'@'localhost' IDENTIFIED BY 'mysql_monitor';
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'mysql_monitor'@'10.15.15.60';

docker run -d \
  -p 9104:9104 \
  --name mysql \
  -e DATA_SOURCE_NAME="root:123456@(10.15.15.60:3306)/" prom/mysqld-exporter

##docker 常用命令
    ## 查看IP
      docker inspect --format '{{.NetworkSettings.IPAddress}}'