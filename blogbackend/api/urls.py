from django.urls import path
from . import views

urlpatterns = [
  path("dashboard/", views.AuthorDashboardView.as_view(), name="author-dashboard"),
  path('blogs/', views.BlogListView.as_view(), name='blog-list'),
  path('blog/create/', views.CreateListBlogsView.as_view(), name='create-blog'),
  path('blog/<int:pk>/', views.BlogDetailView.as_view(), name='delete-blog'),
  path('check-username/', views.check_username, name='check-username'),
  # path('logout/', views.LogoutView.as_view(), name='logout'),
]