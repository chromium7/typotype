from django.urls import path

from . import views

app_name = "game"

urlpatterns = [
    path("", views.index, name="home"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register, name="register"),
    path("register_text/", views.register_text, name="register_text"),
    path("generate_text/<int:grade>/", views.generate_text, name="generate_text"),
    path("submit/", views.submit_activity, name="submit_activity"),
    
]
