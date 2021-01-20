from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout

from .models import Activity, Profile


def index(request):
    context = {}
    if request.user.is_authenticated:
        pass
    else:
        login_form = AuthenticationForm()
        context['login_form'] = login_form

    if request.session.get('status'):
        context['status'] = request.session['status']
        del request.session['status']

    return render(request, "game/index.html", context)



def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        request.session['status'] = 'g'
    else:
        request.session['status'] = 'n'
    return redirect("game:home")


def logout_view(request):
    logout(request)
    return redirect("game:home")


def register(request):
    
    return render(request, "game/index.html")