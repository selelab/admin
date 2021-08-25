import environ

env = environ.Env()

S3_STATIC_BUCKET_NAME = 'selelab-static'

REDIS_HOST = env.str('REDIS_HOST')
REDIS_PORT = env.str('REDIS_PORT')
REDIS_DB = env.str('REDIS_DB')
REDIS_PASS = env.str('REDIS_PASS')
