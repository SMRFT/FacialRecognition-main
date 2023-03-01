from twilio.rest import Client
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from calendar import monthrange
from time import time
import base64
import json
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
from AttendanceApp.serializers import AdmincalendarSerializer, EmployeeShowSerializer, CalendarSerializer,  EmployeedesignationSerializer, EmployeeShowbydesignationSerializer, HourcalendarSerializer, SummarySerializer, EmployeeexportSerializer, SummaryexportSerializer, BreakhoursSerializer,EmployeeSerializer
from django.db.models import Q
import json
import calendar
import datetime
import pandas as pd
import numpy as np
from django.conf import settings
from django.http import HttpResponse
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId

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
        # print(data)
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
        data = Logout
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
            name = employee['name']
            # Getting 8 hr default by timedelta to calculate overtime
            t2 = timedelta(hours=8, minutes=0, seconds=0)

            # If the employee done overtime the barcolor should be red
            if hour > t2:
                employee['barColor'] = 'red'
            else:
                employee['barColor'] = 'blue'

            employee['text'] = name
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
            # print(hour)
            employee['hour'] = hour
            t2 = timedelta(hours=8, minutes=0, seconds=0)
            if hour > t2:
                employee['barColor'] = 'red'
                overtime += 1
                overtime_dates.append(date)

                overtime_hours = hour - t2
            #    worked_hours = hour - overtime_hours
            else:
                employee['barColor'] = 'blue'
        # Calculating leave dates (finding missing dates using dataframe)
        overime_dates_string = "\n".join(
            date.strftime("%Y-%m-%d") for date in overtime_dates)

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
    @csrf_exempt
    def post(self, request):
        data = request.data
        emp_data = Admincalendarlogin.objects.filter(
            id=data["id"], month=data["month"], year=data["year"]).values()
        emp_details = []

        for employee in emp_data:
            id = employee["id"]
            name = employee["name"]
            date = employee["date"]
            start_time = employee["start"]
            end_time = employee["end"]
            hour = (end_time - start_time)
            break_hours = Breakhours.objects.filter(
                id=id, date=date).values("Breakhour")

            if break_hours:
                break_hours = break_hours[0]["Breakhour"]
            else:
                break_hours = 0

            emp_details.append({
                "id": id,
                "name": name,
                "date": date,
                "start": employee["start"],
                "end": employee["end"],
                "hour": hour,
                "Breakhour": break_hours,
            })

        # Serialize the employee details list and return the response
        serializer = EmployeeexportSerializer(emp_details, many=True)
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
    def post(self, request, *args, **kwargs):
        data = request.data
        user = (Breakhours.objects.get(
            id=data["id"], date=data["date"]))
        user.name = data["name"]
        user.lunchEnd = data["lunchEnd"]
        user.date = data["date"]
        lunch_start = user.lunchstart

        start_datetime = datetime.datetime.strptime(
            lunch_start, '%Y-%m-%d %I:%M %p')
        end_datetime = datetime.datetime.strptime(
            user.lunchEnd, '%Y-%m-%d %I:%M %p')
        difference = end_datetime - start_datetime
        print("Lunch break duration: ", difference)
        user.Breakhour = difference
        user.save()
        data = Logout
        return Response({'lunchStart': lunch_start, 'logout': data,  'Breakhour': str(difference)}, status=status.HTTP_200_OK)


class RetriveBreakhours(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        Empbreak = Breakhours.objects.filter(
            id=data["id"], date=data["date"]).values()
        serializer = BreakhoursSerializer(
            Empbreak, many=True)
        return Response(serializer.data)

#Email
@csrf_exempt
def send_email(request):
    data = json.loads(request.body)
    subject = data['subject']
    # print("data", data)
    message = data['message']
    recipient = data['recipient']
    from_email = 'parthibansmrft@gmail.com'
    signature = 'Contact Us, \n Shanmuga Hospital, \n 24, Saradha College Road,\n Salem-636007 Tamil Nadu,\n 8754033833,\n info@shanmugahospital.com,\n https://shanmugahospital.com/'

    send_mail(subject,  message + '\n\n\n\n\n' +
              signature, from_email, [recipient], fail_silently=False)
    return JsonResponse({'message': 'Email sent successfully'})

#Whatsapp using Twilio 
@csrf_exempt
def send_whatsapp(request):
    account_sid = 'ACe1d37f2342c44648499add958166abe2'
    auth_token = 'c6ff1b2f81b4fcac652d4d71fce766a2'

    data = json.loads(request.body)
    message = data['message']
    to=data['to']
    signature = 'Contact Us, \n Shanmuga Hospital, \n 24, Saradha College Road,\n Salem-636007 Tamil Nadu,\n 8754033833,\n info@shanmugahospital.com,\n https://shanmugahospital.com/'
    client = Client(account_sid, auth_token)
    client.messages.create(
        to=to,
        from_='whatsapp:+14155238886',
        body=message+"\n\n"+signature)
    return HttpResponse("whatsapp message sent sucessfully")
    
...
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['data']
        fs = GridFS(db)

        # Open the uploaded file and read its contents
        uploaded_file = request.FILES['file']
        file_contents = uploaded_file.read()

        # Store the file using GridFS
        file_id = fs.put(file_contents, filename=uploaded_file.name)

        # Check if the file was stored inline or as chunks
        file_info = db.fs.files.find_one({'_id': file_id})
        if 'chunks' in file_info:
            # The file was stored as chunks
            return HttpResponse(f'File uploaded with ID {file_id} (stored as chunks)')
        else:
            # The file was stored inline
            return HttpResponse(f'File uploaded with ID {file_id} (stored inline)')





@csrf_exempt
def get_file(request):
    # Connect to MongoDB
    
    client = MongoClient('mongodb://localhost:27017/')
    db = client['data']
    fs = GridFS(db)
    print("gridfs",fs)
    filename = request.GET.get('filename')
    print("filename",filename)
    # file = fs.find_one({"filename": "parthiban.pdf"})
    file = fs.find_one({"filename": filename })
    print("file",file)
    if file is not None:
        # Return the file contents as an HTTP response
        response = HttpResponse(file.read())
        print("type",response )
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment; filename=%s' % file.filename
        print("filename",file.filename)
        return response
    else:
        # Return a 404 error if the file is not found
        return HttpResponse(status=404)
 