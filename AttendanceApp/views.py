from fractions import Fraction
from pickle import TRUE
from django.shortcuts import render

from AttendanceApp.Views.adminview import EmployeeView, AdminReg, AdminLogin
from AttendanceApp.Views.retrieveemp import RetriveEmp, RetriveEmpById, EmployeeEditView, EmployeeSearchView, AdminCalendarView, AdmincalendarloginView
from AttendanceApp.Views.deteteemp import DeleteEmp
