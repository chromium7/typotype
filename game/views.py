from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm


def index(request):
    login_form = AuthenticationForm()
    return render(request, "game/index.html", {
        'login_form': login_form,
        
    })


def register(request):
    
    return render(request, "game/index.html")