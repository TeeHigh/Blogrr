import random
from django.shortcuts import render
from django.contrib import auth
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from api.auth_backends import CookieJWTAuthentication

from .models import Blog
from .serializers import BlogSerializer, UserSerializer, CustomTokenObtainPairSerializer

import cloudinary.uploader

User = auth.get_user_model()


# --------------------- Auth Views ----------------------------
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "CSRF cookie set"})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@method_decorator(csrf_protect, name='dispatch')
class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # auth.login(request, user)

            response = Response(
                {
                    "user": UserSerializer(user).data,
                    "message": "Registration successful."
                },
                status=status.HTTP_201_CREATED
            )

            return response
        except ValidationError as ve:
            return Response({"error": ve.message_dict}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_protect, name='dispatch')
class LoginView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = auth.authenticate(request, email=email, password=password)

            if not user:
                return Response({"error": "Invalid credentials"}, status=400)
            else:
                auth.login(request, user)
                response = Response({
                    "message": "Login successful",
                    "user": {
                        "email": user.email,
                        "isAuthenticated": True,
                        "username": user.username
                    }
                })

            return response
        except:
            return Response({"error": "Something went wrong while logging in"})


# @method_decorator(csrf_protect, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Logged Out' })
        except:
            return Response({ 'error': 'Something went wrong when logging out' })


class RefreshView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token missing"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            response = Response({"message": "Token refreshed"})
            response.set_cookie(
                "access",
                new_access,
                httponly=True,
                secure=False,  # True in prod
                samesite="None",
                max_age=15 * 60,
            )
            return response
        except TokenError:
            return Response({"error": "Invalid or expired refresh"}, status=401)


class VerifyAuthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        isAuthenticated = user.is_authenticated

        if isAuthenticated:
            return Response({
                "isAuthenticated": True,
                "user": {
                    "email": user.email,
                    "username": user.username
                }
            })
        else:
            return Response({"isAuthenticated": False})

class DeleteAccountView(APIView):
    def delete(self, request, format=None):
        user = self.request.user

        try:
            User.objects.filter(id=user.id).delete()

            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'Something went wrong when trying to delete user' })


# --------------------- Profile Views ----------------------------
class UpdateProfileView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


# --------------------- Blog Views ----------------------------
# Public Blog List view
class BlogListView(generics.ListAPIView):
    queryset = Blog.objects.filter(status=Blog.Status.PUBLISHED, is_archived=False).order_by('-created_at')
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]  # Allow any user to view the list of blogs

class AuthorDashboardView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        blogs = Blog.objects.filter(author=user).order_by('-created_at')
        blog_data = BlogSerializer(blogs, many=True).data

        return Response({
            "author": UserSerializer(user).data,
            "blogs": blog_data
        })


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


# --------------------- Utility Views ----------------------------
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


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_avatar(request, public_id):
    try:
        result = cloudinary.uploader.destroy(public_id)
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(["GET"])
def get_users(request):
    users = User.objects.all()

    abstracted_data = [{"email": user.email, "username": user.username, "id": user.id} for user in users]

    return Response(abstracted_data)

    
