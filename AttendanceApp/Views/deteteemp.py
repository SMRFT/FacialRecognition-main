from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from AttendanceApp.models import Employee
from AttendanceApp.serializers import EmployeeSerializer
from rest_framework.response import Response


class DeleteEmp(APIView):
    @csrf_exempt
    def post(self, request):
        data = request.data
        emp = Employee.objects.get(id=data["id"])
        emp.delete()
