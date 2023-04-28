from curses.ascii import EM
from dataclasses import fields
from rest_framework import serializers
from AttendanceApp.models import Admincalendarlogin, Employee, Admin, Designation, Employeebydesignation, Hour, Summary, Employeeexport, Summaryexport, Breakhours,EmployeeHours,DeletedEmployee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class DeletedEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeletedEmployee
        fields = '__all__'
        
class EmployeeShowSerializer(serializers.ModelSerializer):
    imgSrc = serializers.ImageField(use_url=False)

    class Meta:
        model = Employee
        fields = ('id', 'name', 'mobile', 'designation', 'address', 'profile_picture_id', 'department', 'email', 'BloodGroup', 'educationData', 'experienceData', 'referenceData', 'Aadhaarno', 'PanNo', 'RNRNO', 'TNMCNO', 'ValidlityDate', 'dateofjoining', 'IdentificationMark', 'selectedLanguages', 'bankaccnum', 'dob', 'Maritalstatus', 'Gender', 'imgSrc')


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class AdminregSerializer(serializers.ModelSerializer):
    class Meta:
        model =Admin
        fields = '__all__'

class EmployeedesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = ('label', 'value')


class EmployeeShowbydesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employeebydesignation
        fields = ('id', 'name', 'mobile', 'designation', 'address')


class AdmincalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admincalendarlogin
        fields = '__all__'


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admincalendarlogin
        fields = '__all__'


class HourcalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hour
        fields = '__all__'


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = '__all__'


class EmployeeexportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employeeexport
        fields = '__all__'


class SummaryexportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Summaryexport
        fields = '__all__'


class BreakhoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breakhours
        fields = '__all__'


class EmployeeHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model=EmployeeHours
        fields = '__all__'