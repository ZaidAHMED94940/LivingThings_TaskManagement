# tasks/models.py
from django.db import models
from users.models import User  # Link to the custom User model

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    effort_days = models.IntegerField()
    due_date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')

    def __str__(self):
        return self.title
