import json
import os
from pathlib import Path

# from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-5#y-^bdkqu5-_2ttnr7(^*ai-i$2nh+ef)7+t$+%+hhol59h@!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    # 'rest_framework_simplejwt',
    'corsheaders',
    'AttendanceApp',
    # 'upload.apps.UploadConfig'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Attendance_Management.urls'
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Add the URL of your React app
    # Add any other allowed origins if needed
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'AttendanceUI/build'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'upload.apps.UploadConfig'
            ],
        },
    },
]

WSGI_APPLICATION = 'Attendance_Management.wsgi.application'

with open('E:\parthi\project\project demo 1\FacialRecognition-third-master\AttendanceApp\config.json') as config_file:
    config = json.load(config_file)

COMPREFACE_API_KEY = config['compreface']['api_key']


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'CLIENT': {
#             "host": "localhost:27017",
#             "name": "data",
#         }
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'CLIENT': {
            "host": "mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority",
            "name": "demodatabase",
            "authMechanism": "SCRAM-SHA-1"
        }
    }
}
# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/


STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# for authentication

AUTH_USER_MODEL = 'AttendanceApp.Admin'

APPEND_SLASH = False
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

# ALLOWED_HOSTS = ['.ngrok.io']

# mongo storage connection

GRIDFS_STORAGE_OPTIONS = {
    'location': 'mongodb://localhost:27017/',
    'database': 'data',
    'base_url': '/media/',
}
DEFAULT_FILE_STORAGE = 'gridfs_storage.storage.GridFSStorage'

# email sender
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = 'parthibansmrft@gmail.com'
EMAIL_HOST_PASSWORD = 'jgnuxbycnzywwvlw'

# whatsapp
TWILIO_ACCOUNT_SID = 'ACe1d37f2342c44648499add958166abe2'
TWILIO_AUTH_TOKEN = 'c6ff1b2f81b4fcac652d4d71fce766a2'
# whatsapp vonage
VONAGE_API_KEY = '4be358a0'
VONAGE_API_SECRET = '6GF9TK0JGgbe4V0A'
VONAGE_BRAND_NAME = 'parthiban'
