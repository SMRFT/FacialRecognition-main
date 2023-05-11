from twilio.rest import Client
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from calendar import monthrange
from time import time
import base64
import json
from datetime import datetime

from datetime import timedelta
import calendar
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
from rest_framework.decorators import api_view
from .constants import Login, Logout
from django.db.models.functions import TruncDate
from AttendanceApp.models import Employee, Admincalendarlogin, Hour, Breakhours, DeletedEmployee
from AttendanceApp.serializers import AdmincalendarSerializer, EmployeeShowSerializer, CalendarSerializer,  EmployeedesignationSerializer, EmployeeShowbydesignationSerializer, HourcalendarSerializer, SummarySerializer, EmployeeexportSerializer, SummaryexportSerializer, BreakhoursSerializer, EmployeeSerializer, EmployeeHoursSerializer, DeletedEmployeeSerializer
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
        emp_id = request.query_params.get('id')
        if emp_id:
            try:
                emp = Employee.objects.get(id=emp_id)
                serializer = EmployeeShowSerializer(emp)
                return Response(serializer.data)
            except Employee.DoesNotExist:
                return Response({'error': f'Employee with ID {emp_id} does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            emp_details = Employee.objects.all()
            serializer = EmployeeShowSerializer(emp_details, many=True)
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
    @csrf_exempt
    def put(self, request, *args, **kwargs):
        data = request.data
        employee = Employee.objects.get(id=data["id"])
        employee.name = data["name"]
        employee.mobile = data["mobile"]
        employee.designation = data["designation"]
        employee.address = data["address"]
        employee.department = data["department"]
        employee.email = data["email"]
        employee.Aadhaarno = data["Aadhaarno"]
        employee.PanNo = data["PanNo"]
        employee.RNRNO = data["RNRNO"]
        employee.TNMCNO = data["TNMCNO"]
        employee.ValidlityDate = data["ValidlityDate"]
        employee.educationData = data["educationData"]

        # Get the GridFS instance
        client = MongoClient(
            "mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority")
        db = client["data"]
        fs = GridFS(db)

        # Delete existing proof file and insert the new proof file
        if 'proof' in request.FILES:
            proof_file = request.FILES['proof']
            file_contents1 = proof_file.read()
            existing_proof_file = fs.find_one(
                {"employee_id": employee.id, "filename": employee.name + "_" + employee.id + "_proof.pdf"})
            if existing_proof_file:
                fs.delete(existing_proof_file._id)
            proof_file_id = fs.put(file_contents1, filename=employee.name + "_" + employee.id +
                                   "_proof.pdf", employee_id=employee.id, employee_name=employee.name)

        # Delete existing certificates file and insert the new certificates file
        if 'certificates' in request.FILES:
            certificates_file = request.FILES['certificates']
            file_contents = certificates_file.read()
            existing_certificates_file = fs.find_one(
                {"employee_id": employee.id, "filename": employee.name + "_" + employee.id + "_certificate.pdf"})
            if existing_certificates_file:
                fs.delete(existing_certificates_file._id)
            certificates_file_id = fs.put(file_contents, filename=employee.name + "_" + employee.id +
                                          "_certificate.pdf", employee_id=employee.id, employee_name=employee.name)

        employee.save()
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
        # print("calendar details", request.data)
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
        user.earlyLogout = data["earlyLogout"]
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


# Retrieve Calendar data By Id (Calendar Events for working days)
# This view retrieves the calendar login details of an employee with a specific ID and month and
# calculates their work hours and overtime.
class RetrieveCalendarDataById(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        # print("data:", data)
        employeelist = Admincalendarlogin.objects.filter(
            id=data["id"], month=data["month"], year=data['year']).values()
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
            # Check if leavetype is null or not
            if employee['leavetype'] is None:
                employee['text'] = 'Event'
            else:
                # If leavetype is 'CL' or 'SL', set text accordingly
                if employee['leavetype'] == 'CL':
                    employee['text'] = 'CL'
                    employee['barColor'] = 'green'
                elif employee['leavetype'] == 'SL':
                    employee['text'] = 'SL'
                    employee['barColor'] = 'yellow'
            # Add 'text' key to employee dictionary if it doesn't exist
            if 'text' not in employee:
                employee['text'] = "Event"
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
            data = employeedata.values("date")
            df = pd.DataFrame(data)
            df = df.set_index("date")
            df.index = pd.to_datetime(df.index)
            todayDate = datetime.date.today()
            # print(todayDate)
            start_date = todayDate.replace(day=1)
            # print("start",start_date)
            end_date = todayDate
            # print(end_date)
            xy = pd.date_range(
                start=start_date, end=end_date).difference(df.index)
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

        # leavedays="0"
        def leavedates():
            data = employeedata.values("date")
            df = pd.DataFrame(data)
            df = df.set_index("date")
            df.index = pd.to_datetime(df.index)
            todayDate = datetime.date.today()
            start_date = todayDate.replace(day=1)
            end_date = todayDate
            xy = pd.date_range(
                start=start_date, end=end_date).difference(df.index)
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
            month = employee["month"]
            start_time = employee["start"]
            end_time = employee["end"]
            shift = employee["shift"]
            leavetype = employee["leavetype"]
            if start_time is None or end_time is None:
                continue  # skip this employee if start_time or end_time is None
            hour = end_time - start_time
            # print(hour)
            break_hours = Breakhours.objects.filter(
                id=id, date=date).values("Breakhour")
            if break_hours:
                break_hours = break_hours[0]["Breakhour"]
            else:
                break_hours = 0
            overtime_hours = timedelta(0)
            t2 = timedelta(hours=8, minutes=0, seconds=0)
            if hour > timedelta(hours=8):
                overtime_hours = hour - t2
                print(overtime_hours)
            worked_hours = hour - overtime_hours
            if leavetype is None or leavetype.lower() == "none":
                leavetype = "Present"  # set leavetype to "Present" if it is None or "None"
                worked_days = 1  # set worked_days to 1 if leavetype is "Present"
            else:
                worked_days = 0
            emp_details.append({
                "id": id,
                "name": name,
                "date": date,
                "start": employee["start"],
                "end": employee["end"],
                "month": employee["month"],
                "shift": employee["shift"],
                "workeddays": worked_days,
                "workedhours": str(worked_hours),
                "Breakhour": str(break_hours),
                "overtimehours": str(overtime_hours),
                "Total_hours_worked": str(hour),
                "leavetype": leavetype
            })
        # Serialize the employee details list and return the response
        serializer = EmployeeexportSerializer(emp_details, many=True)
        return Response(serializer.data)
# Export Calendar Details

# Export Calendar Details (Summary export for download outside the calendar(Employee details))
# This view is for exporting overall employee details per month
# Export Calendar Details (Summary export for download outside the calendar(Employee details))
# This view is for exporting overall employee details per month


class RetriveSummaryExport(APIView):
    def post(self, request):
        data = request.data
        month = data["month"]
        year = data["year"]
        # get the selected department value
        selected_department = data.get("department", "")
        # Get all employees who have logged in during the specified month and year
        emp_data = Admincalendarlogin.objects.filter(
            Q(month=month) & Q(year=year)).values()
        emp_ids = emp_data.values_list("name", flat=True).distinct()
        # Define an empty queryset
        queryset = Employee.objects.none()
        if selected_department:
            queryset = queryset.filter(department=selected_department)
        emp_ids = emp_data.values_list("name", flat=True).distinct()
        # Create a list to store the details for each employee
        emp_details = []
        for emp_id in emp_ids:
            # Split the name and id of the employee
            emp_id_split = emp_id.split("_")
            id = emp_id_split[1] if len(emp_id_split) >= 2 else None
            name = emp_id_split[0] if len(emp_id_split) >= 1 else None
            # Initialize variables for calculating the different values
            working_days = 0
            loss_of_pay = 0
            overtime_days = 0
            total_weekoff = 0
            weekoff_used = 0
            cl_taken = 0
            sl_taken = 0
            # Loop through the filtered queryset for the employee and calculate the values
            for employee in emp_data.filter(name=emp_id):
                if employee["leavetype"] == "None":
                    start_time = employee["start"]
                    end_time = employee["end"]
                    hour = end_time - start_time
                    if hour > timedelta(hours=8):
                        overtime_days += (hour - timedelta(hours=8)
                                          ).total_seconds() / 3600
                    # Check if the event occurred on a Sunday
                    if start_time.weekday() == 6:
                        working_days += 1
                        weekoff_used += 1  # Increment weekoff_used since it's a working day on Sunday
                    else:
                        working_days += 1
                elif employee["leavetype"] == "CL":
                    cl_taken += 1
                elif employee["leavetype"] == "SL":
                    sl_taken += 1
             # Get the number of days in the specified month and year
            days_in_month = calendar.monthrange(year, month)[1]
            # Calculate the total number of Sundays in the month
            month_calendar = calendar.monthcalendar(year, month)
            total_sundays = sum(1 for week in month_calendar if week[6] != 0)
            # Get the number of days in the specified month and year
            month_days = calendar.monthrange(year, month)[1]
            today = datetime.date.today()
            if month == today.month and year == today.year:
                month_days = today.day
            # # Update the total_weekoff and weekoff_used variables
            total_weekoff += total_sundays
            remaining_weekoff = total_weekoff - weekoff_used
            # Calculate the number of leave days
            loss_of_pay = days_in_month - \
                (working_days + cl_taken + sl_taken + remaining_weekoff)
            # Add the details for the employee to the list
            if id:
                emp_det = Employee.objects.filter(
                    id=id).values('department', 'designation')
                if emp_det:
                    department = emp_det[0]['department']
                    designation = emp_det[0]['designation']
                else:
                    department = None
                    designation = None
            else:
                department = None
                designation = None
            # add the employee details only if they belong to the selected department or if no department is selected
            if not selected_department or department == selected_department:
                # Create a dictionary to store the details for the employee
                emp_dict = {
                    "id": id,
                    "name": name,
                    "month": month,
                    "year": year,
                    "department": department,
                    "designation": designation,
                    "workingdays": working_days,
                    "overtimedays": overtime_days,
                    "CL_Taken": cl_taken,
                    "SL_Taken": sl_taken,
                    "loss_of_pay": loss_of_pay,
                    "total_weekoff": total_weekoff,
                    "weekoff_used": weekoff_used,
                    "remaining_weekoff": remaining_weekoff,
                    "Days_in_a_month": days_in_month
                }
                # Add the details for the employee to the list
                emp_details.append(emp_dict)
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
        # print("Lunch break duration: ", difference)
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

# Email


@csrf_exempt
def send_email(request):
    data = json.loads(request.body)
    subject = data['subject']
    message = data['message']
    recipient = data['recipient']
    # get list of CC recipients from data or empty string if not provided
    cc_recipients = data.get('cc', 'parthipanmurugan335317@gmail.com')
    from_email = 'parthibansmrft@gmail.com'
    signature = 'Contact Us, \n Shanmuga Hospital, \n 24, Saradha College Road,\n Salem-636007 Tamil Nadu,\n 8754033833,\n info@shanmugahospital.com,\n https://shanmugahospital.com/'

    recipient_list = [recipient]  # start with primary recipient
    if cc_recipients:
        # add CC recipients to the list
        recipient_list += cc_recipients.split(',')

    send_mail(subject, message + '\n\n\n\n\n' + signature,
              from_email, recipient_list, fail_silently=False)
    return JsonResponse({'message': 'Email sent successfully'})

# Whatsapp using Twilio


@csrf_exempt
def send_whatsapp(request):
    account_sid = 'ACe1d37f2342c44648499add958166abe2'
    auth_token = 'c6ff1b2f81b4fcac652d4d71fce766a2'

    data = json.loads(request.body)
    message = data['message']
    to = data['to']
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
        client = MongoClient(
            'mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
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

    client = MongoClient(
        'mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
    db = client['data']
    fs = GridFS(db)
    # print("gridfs",fs)
    filename = request.GET.get('filename')
    # print("filename",filename)
    # file = fs.find_one({"filename": "parthiban.pdf"})
    file = fs.find_one({"filename": filename})
    # print("file",file)
    if file is not None:
        # Return the file contents as an HTTP response
        response = HttpResponse(file.read())
        # print("type",response )
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment; filename=%s' % file.filename
        # print("filename",file.filename)
        return response
    else:
        # Return a 404 error if the file is not found
        return HttpResponse(status=404)


@csrf_exempt
def get_profile_image(request):
    # Connect to MongoDB
    client = MongoClient(
        'mongodb+srv://madhu:salem2022@attedancemanagement.oylt7.mongodb.net/?retryWrites=true&w=majority')
    db = client['data']
    fs = GridFS(db)

    # Get the employee's profile_picture_id from the request
    profile_picture_id = request.GET.get('profile_picture_id')

    # Look up the corresponding file in GridFS
    file = fs.find_one(ObjectId(profile_picture_id))

    if file is not None:
        # Return the file contents as an HTTP response
        response = HttpResponse(file.read())
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment; filename=%s' % file.filename
        return response
    else:
        # Return a 404 error if the file is not found
        return HttpResponse(status=404)


class RetrieveEmployeehours(APIView):
    def post(self, request):
        data = request.data
        day = data.get("day")
        month = data.get("month")
        year = data.get("year")
        emp_id = data.get("id")
        # Get all employees who have logged in during the specified month and year
        emp_data = Admincalendarlogin.objects.filter(
            Q(day=day) & Q(month=month) & Q(year=year))
        # Filter by employee ID if it is provided
        if emp_id:
            emp_data = emp_data.filter(id=emp_id)
        emp_data = emp_data.values()
        # Serialize the employee details list and return the response
        serializer = EmployeeHoursSerializer(emp_data, many=True)
        return Response(serializer.data)

    # Retrieve Break Hours
# This view retrieves the break login and logout time for break details


class RetrieveBreak(APIView):
    @csrf_exempt
    def get(self, request):
        current_date = datetime.date.today()
        # get the department parameter from the request query params
        department = request.GET.get('department')
        employees = Employee.objects.all()
        if department:  # check if department is present in the query params
            # filter employees based on the selected department
            employees = employees.filter(department=department)
        emp_breaks = Breakhours.objects.filter(date=current_date)
        # Get the list of employee IDs that are currently on break
        emp_ids_on_break = [emp.id for emp in emp_breaks]
        # Remove employees whose break duration has ended
        for emp in emp_breaks:
            if emp.Breakhour != "0":
                emp_ids_on_break.remove(emp.id)
        # Filter the employees based on whether they are on break or not
        employees_on_break = Employee.objects.filter(id__in=emp_ids_on_break)
        # Get the list of employee IDs that have logged in today
        employee_logins = Admincalendarlogin.objects.filter(
            date=current_date).values()
        emp_ids_logged_in = [emp['id'] for emp in employee_logins]
        # Filter the employees based on whether they are on break or not
        employees_on_break = employees.filter(id__in=emp_ids_on_break)
        # Filter the employees based on whether they have logged in today or not
        employees_not_on_break = employees.exclude(id__in=emp_ids_on_break)
        employees_not_on_break = employees_not_on_break.exclude(
            id__in=emp_ids_logged_in)
        # Filter the employees based on whether they are active or not
        employees_active = employees.filter(id__in=emp_ids_logged_in)
        # Create a dictionary to store employee IDs and their corresponding lunch start times
        emp_lunch_starts = {}
        for emp in emp_breaks:
            if emp.id in emp_ids_on_break:
                emp_lunch_starts[emp.id] = emp.lunchstart
        # Create a list of dictionaries to store employee details along with their lunch start times
        emp_details_on_break = []
        for emp in employees_on_break:
            emp_dict = EmployeeShowSerializer(emp).data
            lunch_start = emp_lunch_starts.get(emp.id)
            break_start_time = datetime.datetime.strptime(
                lunch_start, "%Y-%m-%d %I:%M %p")
            emp_dict["break_start_time"] = datetime.datetime.strftime(
                break_start_time, "%I:%M %p")
            emp_details_on_break.append(emp_dict)
        # Create a list of dictionaries for employees not on break
        emp_details_not_on_break = []
        for emp in employees_not_on_break:
            emp_dict = EmployeeShowSerializer(emp).data
            emp_details_not_on_break.append(emp_dict)
        # Create a list of dictionaries for active employees
        emp_details_active = []
        for emp in employees_active:
            emp_dict = EmployeeShowSerializer(emp).data
            emp_details_active.append(emp_dict)
        # Return a response containing the three lists: employees on break, employees not on break but active, and employees not on break and not active
        response_data = {
            "employees_on_break": emp_details_on_break,
            "employees_active": emp_details_active,
            "employees_not_active": emp_details_not_on_break
        }
        return Response(response_data)
