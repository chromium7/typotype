from django.contrib import admin
from .models import Activity, Grade, Profile, Sentence 


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'grade', 'score', 'created']
    list_filter = ['grade']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    pass


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'score']


@admin.register(Sentence)
class SentenceAdmin(admin.ModelAdmin):
    pass