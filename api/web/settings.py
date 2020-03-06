"""
Django settings for web project.

Generated by 'django-admin startproject' using Django 3.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
from typing import List

import environ

env = environ.Env()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PACKAGE_ROOT = os.path.abspath(os.path.dirname(__file__))
IMAGE_ROOT = os.path.join(PACKAGE_ROOT, 'static/images')
STATICFILES_DIRS = (os.path.join(PACKAGE_ROOT, 'static'), IMAGE_ROOT)
STATIC_ROOT = '/var/static'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG')

ALLOWED_HOSTS: List[str] = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin', 'django.contrib.auth',
    'django.contrib.contenttypes', 'django.contrib.messages',
    'django.contrib.staticfiles', 'accounting', 'authenticate',
    'rest_framework', 'drf_yasg', 'web',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

FORCE_SCRIPT_NAME = env.str('DJANGO_FORCE_SCRIPT_NAME', '')

ROOT_URLCONF = 'web.urls'
LOGIN_REDIRECT_URL = FORCE_SCRIPT_NAME + '/'
LOGIN_URL = FORCE_SCRIPT_NAME + '/api-auth/login'
LOGOUT_URL = FORCE_SCRIPT_NAME + '/api-auth/logout'
STATIC_URL = '/dj-static/'

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ('rest_framework.renderers.JSONRenderer', ),
    'DEFAULT_PERMISSION_CLASSES':
    ('rest_framework.permissions.IsAuthenticated', ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    )
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

CORS_ORIGIN_WHITELIST = [
    "https://selelab.com",
    "http://localhost:8080",
    "http://localhost",
]

CORS_ALLOW_CREDENTIALS = True

WSGI_APPLICATION = 'web.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env.str('DB_NAME'),
        'USER': env.str('DB_USER'),
        'PASSWORD': env.str('DB_PASS'),
        'HOST': env.str('DB_HOST'),
        'PORT': env.str('DB_PORT'),
    }
}

# Redis session
SESSION_ENGINE = 'redis_sessions.session'
SESSION_REDIS = {
    'host': env.str('REDIS_HOST'),
    'port': env.str('REDIS_PORT'),
    'db': env.str('REDIS_DB'),
    'password': env.str('REDIS_PASS') or None,
    'prefix': 'django_session',
    'socket_timeout': 1
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
AUTH_USER_MODEL = 'authenticate.User'

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[%(server_time)s] %(message)s a',
        },
        'heibon': {
            'format':
            '\t'.join([
                "[%(levelname)s]",
                "%(asctime)s",
                "%(name)s:%(lineno)d",
                "%(message)s",
                "%(threadName)s",
            ])
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'heibon',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/debug.log',
            'formatter': 'heibon',
        },
    },
    'loggers': {
        'django': {
            'handlers': [
                'file',
            ],
            'level': 'INFO',
        },
        'django.db.backends': {
            'handlers': [
                'console',
            ],
            'level': 'DEBUG',
        },
    },
}

DEFAULT_HTTP_METHOD_NAMES = ['get', 'post', 'head', 'patch', 'delete']
