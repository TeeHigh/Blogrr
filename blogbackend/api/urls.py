from django.urls import path
from . import views

urlpatterns = [
  path('get-csrf-token/', views.GetCSRFTokenView.as_view(), name='get-csrf-token'),
  path('verify-auth/', views.VerifyAuthView.as_view(), name='verify-auth'),
  # path('profile/<str:username>/', views.UserProfileView.as_view(), name='user-profile'),
  path('update-profile/', views.UpdateProfileView.as_view(), name='update-profile'),

  path("dashboard/", views.AuthorDashboardView.as_view(), name="author-dashboard"),
  path('posts/', views.BlogListView.as_view(), name='blog-list'),
  path('blog/create/', views.CreateListBlogsView.as_view(), name='create-blog'),
  path('post/<uuid:pk>/', views.BlogDetailView.as_view(), name='delete-blog'),

  path('users/', views.get_users, name='get-users'),
  path('check-username/', views.check_username, name='check-username'),
  path('check-email/', views.check_email_availability, name='check-email'),
  path('send-otp/', views.send_otp_to_email, name='send-otp'),
  path('verify-otp/', views.verify_otp, name='verify-otp'),
  path('delete-avatar/<str:public_id>/', views.delete_avatar, name='delete-avatar'),
  # path('reset-password/', views.reset_password, name='reset-password'),
]