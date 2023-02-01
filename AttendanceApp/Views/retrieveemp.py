from calendar import monthrange
from time import time
from unicodedata import name
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from io import StringIO
from django.shortcuts import render
from datetime import datetime, timedelta
from django.db.models import Count
from .constants import Login, Logout
from django.db.models.functions import TruncDate
from AttendanceApp.models import Employee, Admincalendarlogin, Hour, Breakhours
from AttendanceApp.serializers import AdmincalendarSerializer, EmployeeShowSerializer, CalendarSerializer,  EmployeedesignationSerializer, EmployeeShowbydesignationSerializer, HourcalendarSerializer, SummarySerializer, EmployeeexportSerializer, SummaryexportSerializer, BreakhoursSerializer
from django.db.models import Q
import json
import calendar
import datetime
import pandas as pd
import numpy as np

# Retrieve Employee


class RetriveEmp(APIView):
    @csrf_exempt
    def get(self, request):
        data = request.data
        Empdetail = Employee.objects.all()
        serializer = EmployeeShowSerializer(Empdetail, many=True)
        return Response(serializer.data)

# Retrieve Employee By Id


class RetriveEmpById(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        emp = Employee.objects.get(id=int(data["id"]))
        serializer = EmployeeShowSerializer(emp)
        return Response(serializer.data)

# Edit Employee


class EmployeeEditView(APIView):
    @ csrf_exempt
    def put(self, request, *args, **kwargs):
        data = request.data
        user = Employee.objects.get(id=data["id"])
        user.name = data["name"]
        user.mobile = data["mobile"]
        user.designation = data["designation"]
        user.address = data["address"]
        user.save()
        return Response("Updated Successfully")

# Search Employee


class EmployeeSearchView(APIView):
    @ csrf_exempt
    def put(self, request):
        data = request.data
        user = Employee.objects.filter(Q(id=int(data["key"])) |
                                       Q(name=data["key"])
                                       | Q(mobile=data["key"])
                                       | Q(designation=data["key"])
                                       | Q(address=data["key"])
                                       ).values()
        serializer = EmployeeShowSerializer(user, many=True)
        return Response(serializer.data)

# Admincalendar data get method


class AdminCalendarView(APIView):
    @ csrf_exempt
    def get(self, request):
        data = request.data
        data = Admincalendarlogin.objects.all()
        serializers = CalendarSerializer(data, many=True)
        return Response(serializers.data)

# Admincalendar For Login


class AdmincalendarloginView(APIView):
    @ csrf_exempt
    def post(self, request):
        data = request.data
        print(data)
        serializer = AdmincalendarSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print("calendar details", request.data)
        serializer.save()
        data = 'calendardata has Been Added Successfully'
        return Response(data, status=status.HTTP_200_OK)

# Admincalendar For Logout


class AdmincalendarlogoutView(APIView):
    @csrf_exempt
    def put(self, request, *args, **kwargs):
        data = request.data
        user = (Admincalendarlogin.objects.get(
            id=data["id"], date=data["date"]))
        user.name = data["name"]
        user.end = data["end"]
        user.date = data["date"]
        user.save()
        data = 'Updated Successfully'
        return Response(data, status=status.HTTP_200_OK)

# Retrieve Data By Designation


class RetriveEmpBydesignation(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        Empbydesignation = Employee.objects.filter(
            designation=data["designation"]).values()
        serializer = EmployeeShowbydesignationSerializer(
            Empbydesignation, many=True)
        return Response(serializer.data)

# Retrieve Designation Count


class RetriveEmpdesignationCount(APIView):
    @csrf_exempt
    def get(self, request):
        empdsg = Employee.objects.values("designation").annotate(
            value=Count('designation')).order_by()
        # To Count Designation and name it as label and dumps the data into json_object
        for designations in empdsg:
            designations["label"] = designations.pop("designation")
            json_object = json.dumps(designations)
        serializer = EmployeedesignationSerializer(empdsg, many=True)
        return Response(serializer.data)

# Retrieve Calendar data By Id


class RetrieveCalendarDataById(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        employeelist = Admincalendarlogin.objects.filter(
            id=data["id"], month=data["month"]).values()
        # Adding 1 to every id (103 as 1031,1032) to avoid duplicate id error in calendar
        i = 1
        for employee in employeelist:
            emp_id = f"{employee['id']}{i}"
            i += 1

            # Calculating worked hours of an employee
            start_time = employee['start']
            end_time = employee['end']
            hour = end_time - start_time
            employee['hour'] = hour

            # Getting 8 hr default by timedelta to calculate overtime
            t2 = timedelta(hours=8, minutes=0, seconds=0)

            # If the employee done overtime the barcolor should be red
            if hour > t2:
                employee['barColor'] = 'red'
            else:
                employee['barColor'] = 'blue'

            employee['text'] = 'Event'
            employee["id"] = emp_id

        serializers = HourcalendarSerializer(employeelist, many=True)
        return Response(serializers.data)

# Retrieve Summary details


class Summary(APIView):
    @ csrf_exempt
    def post(self, request):
        data = request.data
        employeedata = Admincalendarlogin.objects.filter(
            id=data["id"], month=data["month"]).values()

        # Calculating working days (finding len of the employeedata query)
        def workingdays():
            return len(employeedata)

        # Calculating leave days (finding missing dates using dataframe)

        def leavedays():
            data = employeedata.values('date')
            df = pd.DataFrame(data)
            df = df.set_index('date')
            df.index = pd.to_datetime(df.index)
            todayDate = datetime.date.today()
            if todayDate.day > 31:
                todayDate += datetime.timedelta(7)
            x = todayDate.replace(day=1)
            nxt_mnth = x.replace(day=28) + datetime.timedelta(days=4)
            y = nxt_mnth - datetime.timedelta(days=nxt_mnth.day)
            xy = pd.date_range(start=x, end=y).difference(df.index)
            return len(xy)
        # Calculating Overtime and overtime details
        overtime = 0
        overtime_dates = []
        overtime_hours = []
        # worked_hours = 0
        for employee in employeedata:
            date = employee["date"]
            start_time = employee['start']
            end_time = employee['end']
            hour = end_time - start_time
            employee['hour'] = hour
            t2 = timedelta(hours=8, minutes=0, seconds=0)
            if hour > t2:
                employee['barColor'] = 'red'
                overtime += 1
                overtime_dates.append(date)
                overime_dates_string = "\n".join(
                    date.strftime("%Y-%m-%d") for date in overtime_dates)
                overtime_hours = hour - t2
            #    worked_hours = hour - overtime_hours
            else:
                employee['barColor'] = 'blue'
        # Calculating leave dates (finding missing dates using dataframe)

        def leavedates():
            data = employeedata.values("date")
            df = pd.DataFrame(data)
            df = df.set_index("date")
            df.index = pd.to_datetime(df.index)
            todayDate = datetime.date.today()
            if todayDate.day > 31:
                todayDate += datetime.timedelta(7)
            x = todayDate.replace(day=1)
            nxt_mnth = x.replace(day=28) + datetime.timedelta(days=4)
            y = nxt_mnth - datetime.timedelta(days=nxt_mnth.day)
            xy = pd.date_range(start=x, end=y).difference(df.index)
            leave_dates = " ".join(date.strftime("%Y-%m-%d") for date in xy)
            return leave_dates
        for employee in employeedata:
            employee["overtime"] = overtime
            employee["workingdays"] = workingdays()
            employee["leavedays"] = leavedays()
            employee["overtimedate"] = overime_dates_string
            employee["leavedates"] = leavedates()
            employee['overtimehours'] = overtime_hours
            employee["workedhours"] = hour
        serializers = SummarySerializer(employeedata, many=True)
        return Response(serializers.data)
# Export Calendar Details


class RetriveEmployeeexport(APIView):
    @ csrf_exempt
    def post(self, request):
        data = request.data
        Empdetail = Admincalendarlogin.objects.filter(
            name=data["name"]).values()
        serializer = EmployeeexportSerializer(Empdetail, many=True)
        return Response(serializer.data)


# Export Calendar Details


class RetriveSummaryExport(APIView):
    def post(self, request):
        data = request.data
        month = data["month"]
        year = data["year"]

        # Get all employees who have logged in during the specified month and year
        emp_data = Admincalendarlogin.objects.filter(
            Q(month=month) & Q(year=year)).values()

        emp_ids = emp_data.values_list("name", flat=True).distinct()

        # Create a list to store the details for each employee
        emp_details = []

        for emp_id in emp_ids:
            # Split the name and id of the employee
            emp_id_split = emp_id.split("_")
            id = emp_id_split[1]
            name = emp_id_split[0]
            # Get the number of working days for the employee during the specified month and year
            working_days = emp_data.filter(name=emp_id).count()
            # Get the number of days in the specified month and year
            month_days = monthrange(year, month)[1]
            # Calculate the number of leave days
            leave_days = month_days - working_days

            # Get the number of overtime hours for the employee during the specified month and year
            overtime_hours = 0
            for employee in emp_data.filter(name=emp_id):
                start_time = employee["start"]
                end_time = employee["end"]
                hour = end_time - start_time
                if hour > timedelta(hours=8):
                    overtime_hours += (hour - timedelta(hours=8)
                                       ).total_seconds() / 3600

            # Add the details for the employee to the list
            emp_details.append({
                "id": id,
                "name": name,
                "month": month,
                "year": year,
                "workingdays": working_days,
                "leavedays": leave_days,
                "overtime": overtime_hours,
            })

        # Serialize the employee details list and return the response
        serializer = SummaryexportSerializer(emp_details, many=True)
        return Response(serializer.data)


class BreakhoursView(APIView):
    @ csrf_exempt
    def post(self, request):
        data = request.data
        serializer = BreakhoursSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = Login
        return Response(data, status=status.HTTP_200_OK)


class BreakhourslogoutView(APIView):
    @csrf_exempt
    def put(self, request, *args, **kwargs):
        data = request.data
        user = (Breakhours.objects.get(
            id=data["id"], date=data["date"]))
        user.name = data["name"]
        user.lunchEnd = data["lunchEnd"]
        user.date = data["date"]
        user.save()
        data = Logout
        return Response(data, status=status.HTTP_200_OK)
