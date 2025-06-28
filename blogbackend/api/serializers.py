from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Blog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
      model = User
      fields = ['id', 'username', 'password', 'email']
      extra_kwargs = {
        'password': {'write_only': True},
        'email': {'required': True}
      }

    def create(self, validated_data):
      user = User.objects.create_user(**validated_data)
      return user


class BlogSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author']

    def get_author(self, obj):
        return obj.author.get_full_name() or obj.author.username
