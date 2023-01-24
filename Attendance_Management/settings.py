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

ALLOWED_HOSTS = []


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


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'CLIENT': {
            "host": "localhost:27017",
            "name": "data",
        }
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'CLIENT': {
#             "host": "mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority",
#             "name": "demodatabase",
#             "authMechanism": "SCRAM-SHA-1"
#         }
#     }
# }
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
# REACT_DIR = os.environ.get('REACT_DIR', '/path/to/react/app/')
# REACT_ROOT_URL_FILES = os.environ.get(
#     "REACT_ROOT_URL_FILES", 'favicon.png manifest.json robots.txt').split(" ")

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
# MEDIA_URL = '/media/'
# STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
# STATICFILES_DIRS = [
#     os.path.join(REACT_DIR, 'AttendanceUI', 'build', 'static')
# ]
# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# STATICFILES_STORAGE = 'myproject.storage.S3Storage'
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'AttendanceUI/build/static')
# ]

# for authentication

AUTH_USER_MODEL = 'AttendanceApp.Admin'


CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True


# mongo storage connection

# DEFAULT_GRIDFS_URL = 'mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority'
# if set to None, it will refuse to serve files and raise an Exception
# DEFAULT_GRIDFS_SERVE_URL = None
# DEFAULT_GRIDFS_COLLECTION = 'storage'

# DEFAULT_FILE_STORAGE = 'gridfs_storage.storage.GridFSStorage'
