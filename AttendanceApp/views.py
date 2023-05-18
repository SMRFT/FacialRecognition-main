from fractions import Fraction
from pickle import TRUE
from django.shortcuts import render

from AttendanceApp.Views.adminview import EmployeeView, AdminReg, AdminLogin
from AttendanceApp.Views.retrieveemp import RetriveEmp, RetriveEmpById, EmployeeEditView, EmployeeSearchView, AdminCalendarView, AdmincalendarloginView
from AttendanceApp.Views.deteteemp import DeleteEmp
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import requests
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


from django.http import JsonResponse


@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        image_file = request.FILES['image']
        # Replace with your Compreface API key
        api_key = '55d4267d-da5f-4194-832c-9e2504002c56'
        endpoint = 'http://localhost:8000/api/v1/recognition/faces/?subject='
        headers = {
            'accept': 'application/json',
            'authorization': f'Token {api_key}',
            'x-api-key': api_key,
        }

        files = {'image': image_file}

        response = requests.post(endpoint, headers=headers, files=files)

        # Process the Compreface response here
        # You can access the response JSON using response.json()

        # Return the JSON response directly
        return JsonResponse(response.json())

    return JsonResponse({'error': 'Invalid request method'})
