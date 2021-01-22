from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from .models import Activity, Profile, Sentence, Grade
from .forms import UserRegistrationForm
from .helper import get_rank


def index(request):
    context = {}
    user = request.user
    if user.is_authenticated:
        # Get user statistics
        activity_count = user.activities.count()
        cum_score = user.profile.score
        recent_activities = user.activities.order_by('-created')[:5]
        user_rank = get_rank(user)

        context['activity-count'] = activity_count
        context['cum-score'] = cum_score
        context['rec-activities'] = recent_activities
        context['rank'] = user_rank
        
    else:
        # Pass login and registration forms
        login_form = AuthenticationForm()
        registration_form = UserRegistrationForm()

        context['login_form'] = login_form
        context['registration_form'] = registration_form

    # Check if a status is available and put it in context
    if request.session.get('status'):
        context['status'] = request.session['status']
        del request.session['status']

    return render(request, "game/index.html", context)


@require_POST
def register_text(request):
    text = request.POST['new-sentence']
    grade = Grade.objects.get(level=int(request.POST['grade']))
    entry = Sentence.objects.create(grade=grade, text=text)
    entry.save()
    return redirect("grame:home")


@csrf_exempt
def generate_text(request):
    return HttpResponse("BRUH", content_type="text/plain")


@require_POST
def submit_activity(request):
    pass


@require_POST
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


@require_POST
def logout_view(request):
    logout(request)
    return redirect("game:home")


@require_POST
def register(request):
    form = UserRegistrationForm(request.POST)
    if form.is_valid():
        new_user = form.save(commit=False)
        new_user.set_password(form.cleaned_data['password'])
        new_user.save()
    else:
        request.session['status'] = 'nr'
    return redirect("game:home")
