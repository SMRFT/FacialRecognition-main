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
from django.core.mail import send_mail
from django.http import JsonResponse
from gridfs_storage.storage import GridFSStorage
from django.utils import timezone
# image upload via local disk
image_storage = FileSystemStorage(
    # Physical file location ROOT
    location=u'{0}/my_Employee/'.format(
        settings.MEDIA_ROOT),
    # Url for file
    base_url=u'{0}my_Employee/'.format(
        settings.MEDIA_URL),
)


import datetime
import uuid

# def image_directory_path(instance, filename):
#     # generate a new filename with timestamp and instance information
#     extension = filename.split('.')[-1]
#     new_filename = f"{instance.name}_{instance.id}_{uuid.uuid4().hex}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.{extension}"
#     return u'picture/{0}'.format(new_filename)

def image_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/my_sell/picture/<filename>
    extension = filename.split('.')[-1]
    new_filename = f"{instance.name}_{instance.id}.{extension}"
    return u'picture/{0}'.format(new_filename)

# Employee


class Employee(models.Model):
    id = models.CharField(primary_key=True, max_length=500)
    name = models.CharField(max_length=500)
    Gender = models.CharField(max_length=10)
    dob = models.CharField(max_length=500)
    Maritalstatus= models.CharField(max_length=10)
    mobile = models.CharField(max_length=500)
    department = models.CharField(max_length=500)
    RNRNO = models.IntegerField(blank=True, null=True)
    TNMCNO = models.CharField(max_length=500, blank=True, null=True)
    ValidlityDate = models.DateField(blank=True, null=True)
    email = models.CharField(max_length=500)
    dateofjoining = models.DateField()
    bankaccnum = models.IntegerField()
    proof = models.FileField(storage=GridFSStorage())
    certificates = models.FileField(storage=GridFSStorage())
    designation = models.CharField(max_length=500)
    Aadhaarno= models.CharField(max_length=500)
    PanNo=models.CharField(max_length=500)
    IdentificationMark=models.CharField(max_length=500)
    BloodGroup=models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    imgSrc = models.ImageField(
        upload_to=image_directory_path, storage=image_storage) 
    imgSrcname = models.CharField(max_length=500)
    educationData = models.CharField(max_length=1200)
    experienceData = models.CharField(max_length=1200)
    referenceData = models.CharField(max_length=1200)
    selectedLanguages = models.CharField(max_length=500, blank=True)

class DeletedEmployee(models.Model):
    id = models.CharField(primary_key=True, max_length=500)
    name = models.CharField(max_length=500)
    email = models.CharField(max_length=500)
    mobile = models.CharField(max_length=500)
    department = models.CharField(max_length=500)
    deleted_at =models.DateField()
    designation = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    imgSrc = models.ImageField(
        upload_to=image_directory_path, storage=image_storage) 
    educationData = models.CharField(max_length=1200)
    experienceData = models.CharField(max_length=1200)
    referenceData = models.CharField(max_length=1200)
    selectedLanguages = models.CharField(max_length=500, blank=True)
    Aadhaarno= models.CharField(max_length=500)
    PanNo=models.CharField(max_length=500)
    IdentificationMark=models.CharField(max_length=500)
    BloodGroup=models.CharField(max_length=500)
    RNRNO = models.IntegerField(blank=True, null=True)
    TNMCNO = models.CharField(max_length=500, blank=True, null=True)
    ValidlityDate = models.DateField(blank=True, null=True)
    dateofjoining = models.DateField()
    bankaccnum = models.IntegerField()
# Admin Login


class Admin(AbstractUser):
    name = models.CharField(max_length=500)
    email = models.CharField(max_length=500, unique=True)
    password = models.CharField(max_length=500)
    role = models.CharField(max_length=100)
    mobile = models.CharField(max_length=100)  
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
    day = models.IntegerField()
    leavetype = models.CharField(max_length=500)
    latelogin=models.TimeField()
    earlyLogout=models.TimeField()

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
    leavetype = models.CharField(max_length=500)
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
    # month = models.IntegerField()
    # year = models.IntegerField()
    # shift = models.CharField(max_length=500)
    Breakhour = models.CharField(max_length=500)
    hour = models.CharField(max_length=500)
    leavetype = models.CharField(max_length=500)
# Employee calendar export model for all the employee


class Summaryexport(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    month = models.IntegerField()
    year = models.IntegerField()
    workingdays = models.IntegerField()
    leavedays = models.IntegerField()
    overtime = models.IntegerField()
    department = models.CharField(max_length=500)
   

class Breakhours(models.Model):
    id = models.CharField(max_length=500)
    iddate = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    lunchstart = models.CharField(max_length=500)
    lunchEnd = models.CharField(max_length=500)
    date = models.DateField()
    Breakhour = models.CharField(max_length=500)


    
class EmployeeHours(models.Model):
    id = models.CharField(max_length=500,primary_key=True)
    name = models.CharField(max_length=500)
    month = models.IntegerField()
    year = models.IntegerField()
    date = models.DateField()
    day = models.IntegerField()
    latelogin=models.TimeField()
    earlyLogout=models.TimeField()
    # department = models.CharField(max_length=500)
    # designation = models.CharField(max_length=500)