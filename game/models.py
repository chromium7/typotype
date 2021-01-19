from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

# Extend user model with a starting score of 0
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0, db_index=True)

    def __str__(self):
        return f"{self.user.username} Profile"


# Define the grade levels available
class Grade(models.Model):
    level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])

    def __str__(self):
        return f"{self.level}"


# Record user activities
class Activity(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="activities")
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name="activities")
    score = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']
        verbose_name_plural = "activities"

    def __str__(self):
        return f"{self.user.username} has scored {self.score} at grade {self.grade.level}"


# Save the game sentences in database
class Sentence(models.Model):
    text = models.TextField()
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name="sentences")

    def __str__(self):
        return f"Text at level {self.grade.level}"

