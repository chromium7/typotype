from django.contrib import admin
from .models import Activity, Sentence

# Register your models here.


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ["user"]


@admin.register(Sentence)
class SentenceAdmin(admin.ModelAdmin):
    pass
