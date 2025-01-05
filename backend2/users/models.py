from django.db import models

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'USER'  # Matches the existing table in your Node.js database

    def __str__(self):
        return self.username

    @property
    def is_authenticated(self):
        # Since is_active field is removed, this can be simplified if needed
        return True
