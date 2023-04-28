from calendar import calendar
import imp
from pickle import FROZENSET
# from django.conf.urls import url
from django.urls import path, include
from AttendanceApp import views
from AttendanceApp.Views.deteteemp import DeleteEmp,DeletedEmployeeList,PermanentDeleteEmp,RestoreEmployee
from AttendanceApp.Views.adminview import EmployeeView, AdminLogin, AdminReg,UserDetails
from AttendanceApp.Views.retrieveemp import EmployeeEditView, RetriveEmp, EmployeeSearchView, RetriveEmpById, AdminCalendarView, AdmincalendarloginView, AdmincalendarlogoutView, RetrieveCalendarDataById,  RetriveEmpdesignationCount, RetriveEmpBydesignation, Summary, RetriveEmployeeexport, BreakhoursView, BreakhourslogoutView, RetriveSummaryExport, RetriveBreakhours, send_email, send_whatsapp,upload_file,get_file,RetrieveEmployeehours,get_profile_image
from .views import EmployeeView
from AttendanceApp.Views.retrieveemp import RetrieveBreak
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path

# from .views import send_email
urlpatterns = [

    path('addemp', EmployeeView.as_view()),
    path('showemp', RetriveEmp.as_view()),
    path('showempById', RetriveEmpById.as_view()),
    path('delemp', DeleteEmp.as_view()),
    path('editemp', EmployeeEditView.as_view()),
    path('searchemployee', EmployeeSearchView.as_view()),
    path('adminreg', AdminReg.as_view()),
    path('adminlog', AdminLogin.as_view()),
    path('admincalendar', AdminCalendarView.as_view()),
    path('admincalendarlogin', AdmincalendarloginView.as_view()),
    path('admincalendarlogout', AdmincalendarlogoutView.as_view()),
    path('EmpcalendarId', RetrieveCalendarDataById.as_view()),
    path('showempdesignation', RetriveEmpdesignationCount.as_view()),
    path('empbydesignation', RetriveEmpBydesignation.as_view()),
    path('SummaryDetails', Summary.as_view()),
    path('EmployeeExport', RetriveEmployeeexport.as_view()),
    path('lunchhourslogin', BreakhoursView.as_view()),
    path('lunchhourslogout', BreakhourslogoutView.as_view()),
    path('EmployeeSummaryExport', RetriveSummaryExport.as_view()),
    path('breakhours', RetriveBreakhours.as_view()),
    path('send-email/', send_email, name='send_email'),
    path('send-whatsapp/', send_whatsapp, name='send_whatsapp'),
    path('upload_file/', upload_file, name='upload_file'),
    path('get_file', get_file, name='get_file'),
    path('breakdetails', RetrieveBreak.as_view()), 
    path('Employeehours',RetrieveEmployeehours.as_view()),
    path("delete-employee", DeleteEmp.as_view()),
    path('deleted-employees/', DeletedEmployeeList.as_view()),
    path('permanentdelete', PermanentDeleteEmp.as_view()),
    path('restore-employee/', RestoreEmployee.as_view()),
    path("UserDetails", UserDetails.as_view()),
    path('profile_image', get_profile_image, name='profile_image'),

    # path('message/', send_whatsapp, name='message')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
