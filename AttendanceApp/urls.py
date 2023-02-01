from calendar import calendar
import imp
from pickle import FROZENSET
from django.conf.urls import url
from django.urls import path, include
from AttendanceApp import views
from AttendanceApp.Views.deteteemp import DeleteEmp
from AttendanceApp.Views.adminview import EmployeeView, AdminLogin, AdminReg
from AttendanceApp.Views.retrieveemp import EmployeeEditView, RetriveEmp, EmployeeSearchView, RetriveEmpById, AdminCalendarView, AdmincalendarloginView, AdmincalendarlogoutView, RetrieveCalendarDataById,  RetriveEmpdesignationCount, RetriveEmpBydesignation, Summary, RetriveEmployeeexport, BreakhoursView, BreakhourslogoutView, RetriveSummaryExport
from .views import EmployeeView
from django.conf.urls.static import static
from django.conf import settings

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
    path('EmployeeSummaryExport', RetriveSummaryExport.as_view())


]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
