from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Blog

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add user data to the response
        data['user'] = {
            "id": self.user.id,
            "email": self.user.email,
            "username": self.user.username,
            "fullname": self.user.get_full_name(),
        }

        return data


class UserSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(source="full_name")

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'fullname', 'avatar', 'bio', 'genres', 'password'
        ]
        # fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
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
