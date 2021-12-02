# Blockchain Store

Pull images and start/stop docker container (node and mongo services)

```sh
docker-compose help pull
docker-compose --env-file .env.test up

docker-compose down
```

Access docker container

```sh
docker exec -it mongo-container /bin/bash

mongosh
# OR
mongosh "mongodb://localhost:27017" --username myusername
```

Make sure configs populate in docker-compose file

```sh
docker-compose config
```

```sh
# To list running containers
sudo docker ps
# To list all the available containers
sudo docker ps -a
# To start a stopped container
sudo docker start <container_name/ID>
# To stop a running container
sudo docker stop <container_name/ID>
# Inspect images
docker inspect <tag or id>
# Inspect running container
docker inspect <container-id/name>
```
