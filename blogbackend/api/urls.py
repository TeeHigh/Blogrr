from django.urls import path
from . import views

urlpatterns = [
  path("dashboard/", views.AuthorDashboardView.as_view(), name="author-dashboard"),
  path('posts/', views.BlogListView.as_view(), name='blog-list'),
  path('blog/create/', views.CreateListBlogsView.as_view(), name='create-blog'),
  path('post/<uuid:pk>/', views.BlogDetailView.as_view(), name='delete-blog'),
  path('check-username/', views.check_username, name='check-username'),
  path('check-email/', views.check_email_availability, name='check-email'),
  path('send-otp/', views.send_otp_to_email, name='send-otp'),
  path('verify-otp/', views.verify_otp, name='verify-otp'),
  # path('logout/', views.LogoutView.as_view(), name='logout'),
]