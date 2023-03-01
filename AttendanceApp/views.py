from fractions import Fraction
from pickle import TRUE
from django.shortcuts import render

from AttendanceApp.Views.adminview import EmployeeView, AdminReg, AdminLogin
from AttendanceApp.Views.retrieveemp import RetriveEmp, RetriveEmpById, EmployeeEditView, EmployeeSearchView, AdminCalendarView, AdmincalendarloginView
from AttendanceApp.Views.deteteemp import DeleteEmp
from django.core.mail import send_mail
from django.http import JsonResponse,HttpResponse
from django.conf import settings
# from vonage.Sms import Sms
# from vonage.Verify import Verify
# from vonage.Client import Client
# from vonage.VerifyRequest import VerifyRequest
# from vonage.VerifyControlRequest import VerifyControlRequest

# client = Client(key=settings.VONAGE_API_KEY, secret=settings.VONAGE_API_SECRET)
# client = Client(key='4be358a0', secret='6GF9TK0JGgbe4V0A')

# def send_whatsapp(to, message):
#     verify = Verify(client)
#     response = verify.start_verification(
#         VerifyRequest(
#             number=to,
#             brand=settings.VONAGE_BRAND_NAME,
#             sender_id="whatsapp"
#         )
#     )
#     if response["status"] == "0":
#         request_id = response["request_id"]
#         code = input("Please enter the verification code you received: ")
#         response = verify.check(
#             VerifyControlRequest(
#                 request_id=request_id,
#                 code=code
#             )
#         )
#         if response["status"] == "0":
#             response = client.send_message({
#                 "from": {"type": "whatsapp", "number": settings.VONAGE_BRAND_NAME},
#                 "to": {"type": "whatsapp", "number": to},
#                 "message": {"content": {"type": "text", "text": message}}
#             })
#             if response["messages"][0]["status"] == "0":
#                 return True
#             else:
#                 return False
#         else:
#             return False
#     else:
#         return False



