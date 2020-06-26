#!/bin/sh

helm install stable/redis-ha --name storypoint-redis --set replicas=2 --set haproxy.enabled=true --set haproxy.replicas=2