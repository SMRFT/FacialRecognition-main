from curses.ascii import EM
from dataclasses import fields
from rest_framework import serializers
from AttendanceApp.models import Admincalendarlogin, Employee, Admin, Designation, Employeebydesignation, Hour, Summary, Employeeexport, Summaryexport, Breakhours


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class EmployeeShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


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
