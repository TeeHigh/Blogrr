"""
URL configuration for blogbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from api.views import UserRegisterView, LoginView, LogoutView, RefreshView, DeleteAccountView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('rest_framework.urls')),  # Include the default auth URLs

    path('api/user/register/', UserRegisterView.as_view(), name='user-register'),  # URL for user registration
    path("api/user/login/", LoginView.as_view(), name="login_user"),
    path("api/user/logout/", LogoutView.as_view(), name="logout_user"),
    path('api/user/delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    # path("api/refresh/", RefreshView.as_view(), name="token_refresh"),

    path('api/', include('api.urls')),  # Include the URLs your API app
    
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/account/', include('allauth.urls')),  # Optional, for debugging allauth
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
