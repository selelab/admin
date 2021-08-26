import redis
import constants

redis_client = redis.StrictRedis(host=constants.REDIS_HOST, port=constants.REDIS_PORT, db=constants.REDIS_DB, password=constants.REDIS_PASS)
