from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request , 'index.html')

@csrf_exempt
def user(request):
    return HttpResponse(request,'CSRF token is being exempted here!')