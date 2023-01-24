import os.path
import os
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework.authtoken.views import ObtainAuthToken
# from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from django.views.decorators.csrf import csrf_exempt
import jwt
import datetime
from .constants import Addemployee
from AttendanceApp.models import Admin
from AttendanceApp.serializers import EmployeeSerializer, AdminSerializer
# from Attendance_Management.settings import SIMPLE_JWT,REST_FRAMEWORK
from PIL import Image
import io
# django file storage
"""
class EmployeeView(APIView):
    @csrf_exempt
    def post(self, request):
        #image=open(request.data['img'],'rb')
        #im = Image.open(request.data['img'])
        #image_bytes = io.BytesIO()
        #im.save(image_bytes, format='JPEG')
        #request.data['img']=image_bytes.getvalue()
        serializer = EmployeeSerializer(data=request.data)
        #print(serializer)
        #serializer.img.replace(image,filename=serializer.id)
        serializer.is_valid(raise_exception=True)
        serializer.save() #saving User profile
        return Response(serializer.data)
"""
"""
class EmployeeView(APIView):
    @csrf_exempt
    def post(self, request):
        im = Image.open(request.data['img'])
        image_bytes = io.BytesIO()
        im.save(image_bytes, format='JPEG')
        request.data['img']=image_bytes.getvalue()
        serializer = EmployeeSerializer(data=request.data)
        print(request.data['img'])
        serializer.is_valid(raise_exception=True)
        serializer.save() #saving User profile
        return Response(serializer.data)
"""
'''
#Compreface
from tkinter import Y
from compreface import CompreFace
from compreface.service import RecognitionService
from compreface.collections import FaceCollection
from compreface.collections.face_collections import Subjects
from django.http import JsonResponse
DOMAIN: str = 'http://localhost'
PORT: str = '8000'
API_KEY: str = '54cc82e7-9a68-4676-bb75-a3315748598c'
#API_KEY: str = 'da1647cc-856c-4c77-9aa2-0b221cea2754'
compre_face: CompreFace = CompreFace(DOMAIN, PORT)
recognition: RecognitionService = compre_face.init_face_recognition(API_KEY)
face_collection: FaceCollection = recognition.get_face_collection()
subjects: Subjects = recognition.get_subjects()
'''


class EmployeeView(APIView):
    @csrf_exempt
    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        request.COOKIES.get('jwt')
        return Response(Addemployee)


class AdminLogin(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = Admin.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        # token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class AdminReg(APIView):
    @csrf_exempt
    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
