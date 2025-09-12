from django.urls import path
from . import views

urlpatterns = [
  path("dashboard/", views.AuthorDashboardView.as_view(), name="author-dashboard"),
  path('posts/', views.BlogListView.as_view(), name='blog-list'),
  path('blog/create/', views.CreateListBlogsView.as_view(), name='create-blog'),
  path('post/<uuid:pk>/', views.BlogDetailView.as_view(), name='delete-blog'),
  path('verify-auth/', views.VerifyAuthView.as_view(), name='verify-auth'),
  path('get-csrf-token/', views.GetCSRFTokenView.as_view(), name='get-csrf-token'),
  path('check-username/', views.check_username, name='check-username'),
  path('check-email/', views.check_email_availability, name='check-email'),
  path('send-otp/', views.send_otp_to_email, name='send-otp'),
  path('verify-otp/', views.verify_otp, name='verify-otp'),
  path('delete-avatar/<str:public_id>/', views.delete_avatar, name='delete-avatar'),
  path('users/', views.get_users, name='get-users'),
  # path('reset-password/', views.reset_password, name='reset-password'),
]