from dataclasses import fields
from distutils.command.upload import upload
from pickle import TRUE
from turtle import title
from unittest.util import _MAX_LENGTH
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import FileSystemStorage
from django.conf import settings

# image upload via local disk
image_storage = FileSystemStorage(
    # Physical file location ROOT
    location=u'{0}/my_Employee/'.format(
        settings.MEDIA_ROOT),
    # Url for file
    base_url=u'{0}my_Employee/'.format(
        settings.MEDIA_URL),
)


def image_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/my_sell/picture/<filename>
    extension = filename.split('.')[-1]
    new_filename = "%s.%s" % (instance.name, extension)
    return u'picture/{0}'.format(new_filename)

# Employee


class Employee(models.Model):
    id = models.CharField(primary_key=True, max_length=500)
    name = models.CharField(max_length=500)
    mobile = models.CharField(max_length=500)
    department = models.CharField(max_length=500)
    email = models.CharField(max_length=500)
    dateofjoining = models.DateField()
    bankaccnum = models.IntegerField()
    # proof = models.FileField()
    # certificates = models.FileField()
    designation = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    imgSrc = models.ImageField(
        upload_to=image_directory_path, storage=image_storage)
    imgSrcname = models.CharField(max_length=500)

# Admin Login


class Admin(AbstractUser):
    name = models.CharField(max_length=500)
    email = models.CharField(max_length=500, unique=True)
    password = models.CharField(max_length=500)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

# Designation count details


class Designation(models.Model):
    label = models.CharField(max_length=500)
    value = models.IntegerField()

# Employee model by Designation


class Employeebydesignation(models.Model):
    id = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    mobile = models.CharField(max_length=500)
    designation = models.CharField(max_length=500, primary_key=True)
    address = models.CharField(max_length=500)

# Calendar Model


class Admincalendarlogin(models.Model):
    id = models.CharField(max_length=500)
    iddate = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    start = models.DateTimeField()
    end = models.DateTimeField()
    month = models.IntegerField()
    year = models.IntegerField()
    shift = models.CharField(max_length=500)
    date = models.DateField()

# Event calendar model


class Hour(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    start = models.DateTimeField()
    end = models.DateTimeField()
    month = models.IntegerField()
    date = models.DateField()
    barColor = models.CharField(max_length=500)
    text = models.CharField(max_length=500)

# Summary calendar model


class Summary(models.Model):
    id = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    month = models.IntegerField(primary_key=True)
    workingdays = models.IntegerField()
    leavedays = models.IntegerField()
    overtime = models.IntegerField()
    overtimedate = models.DateField()
    leavedates = models.DateField()
    overtimehours = models.CharField(max_length=500)
    workedhours = models.CharField(max_length=500)

# Employee calendar export model for single employee


class Employeeexport(models.Model):
    name = models.CharField(max_length=500)
    start = models.DateTimeField()
    end = models.DateTimeField()
    shift = models.CharField(max_length=500)

# Employee calendar export model for all the employee


class Summaryexport(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    month = models.IntegerField()
    year = models.IntegerField()
    workingdays = models.IntegerField()
    leavedays = models.IntegerField()
    overtime = models.IntegerField()


class Breakhours(models.Model):
    id = models.CharField(max_length=500)
    iddate = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    lunchstart = models.CharField(max_length=500)
    lunchEnd = models.CharField(max_length=500)
    date = models.DateField()
