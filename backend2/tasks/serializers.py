# tasks/serializers.py
from rest_framework import serializers
from users.models import User  # Import the custom User model
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'effort_days', 'due_date', 'user']

    def create(self, validated_data):
        # Use the logged-in user from the request context
        user = self.context['request'].user  # This fetches the user from the token
        validated_data['user'] = user
        return super().create(validated_data)
