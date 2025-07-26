import random
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings

from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Blog
from .serializers import BlogSerializer, UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class BlogListView(generics.ListAPIView):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]  # Allow any user to view the list of blogs

class AuthorDashboardView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        blogs = Blog.objects.filter(author=user).order_by('-created_at')
        blog_data = BlogSerializer(blogs, many=True).data

        return Response({
            "author": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
            "blogs": blog_data
        })
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        token = str(refresh.access_token)

        return Response({
            "user": UserSerializer(user).data,
            "access_token": token,
            "refresh_token": refresh,
        }, status=status.HTTP_201_CREATED)
    

class CreateListBlogsView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]  # Allow only authenticated users to create

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow only authenticated users to delete or update their own blogs and read for others

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Only the author can delete
        if instance.author != request.user:
            return Response({"detail": "You do not have permission to delete this blog."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


@api_view(["GET"])
def check_username(request):
    username = request.GET.get("username")
    if username:
        exists = User.objects.filter(username__iexact=username).exists()
        return Response({"exists": exists})
    return Response({"error": "Username not provided"}, status=400)


@api_view(["GET"])
def check_email_availability(request):
    email = request.GET.get("email", "").strip()
    if not email:
        return Response({"error": "Email not provided"}, status=400)
    try:
        validate_email(email)
    except ValidationError:
        return Response({"error": "Invalid email format"}, status=400)

    exists = User.objects.filter(email__iexact=email).exists()
    print(f"Checking: {email}, Exists: {exists}")
    return Response({"isAvailable": not exists, "email": email})


@api_view(["POST"])
def send_otp_to_email(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email required"}, status=400)

    # validate email format
    try:
        validate_email(email)
    except ValidationError:
        return Response({"error": "Invalid email"}, status=400)

    # check if user exists
    if User.objects.filter(email__iexact=email).exists():
        return Response({"error": "Email already registered"}, status=409)

    otp_code = str(random.randint(100000, 999999))

    # Save it to cache or model (e.g., Redis or OTPVerification model)
    cache.set(f"otp_{email}", otp_code, timeout=300)  # 5 minutes

    # Send OTP email (you can use send_mail or a background task)
    send_mail(
        "Your OTP Code",
        f"Use this code to verify your email: {otp_code}",
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )

    return Response({"message": "OTP sent"})


@api_view(["POST"])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"error": "Missing fields"}, status=400)

    stored_otp = cache.get(f"otp_{email}")

    if stored_otp is None:
        return Response({"error": "OTP expired. Please request a new one."}, status=410)

    if str(stored_otp) != str(otp):  # Safe string comparison
        return Response({"error": "Invalid OTP provided"}, status=401)

    return Response({"verified": True})

