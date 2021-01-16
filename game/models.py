from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.contrib.auth import get_user_model

# User (player)
# User activities -> foreign key user model
# User cumulative points, rank
# Game sentences, sentence grade


class Activity(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="address")


class Sentence(models.Model):
    text = models.TextField()
    grade = models.IntegerField()
