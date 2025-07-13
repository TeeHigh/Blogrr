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

    def validate_username(self, value):
      if User.objects.filter(username__iexact=value).exists():
          raise serializers.ValidationError("This username is already taken.")
      return value

    def create(self, validated_data):
      user = User.objects.create_user(
          username=validated_data["username"],
          email=validated_data["email"],
          password=validated_data["password"]
      )
      return user


class BlogSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Blog
        # fields = ['id', 'title', 'summary', 'content', 'created_at', 'updated_at', 'author']
        fields = '__all__'

    def get_author(self, obj):
        return obj.author.get_full_name() or obj.author.username
