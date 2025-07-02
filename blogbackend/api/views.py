from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .models import Blog
from .serializers import BlogSerializer, UserSerializer

#IMPORTANT: The following views are for the blog API. They are used to handle requests related to blogs.

# View to display blog list to general users - read only#
# View to display author blog list to logged in authors and create new blogs - create, read#
# View to edit existing blogs for logged in authors and view only for unauthenticated users - read, update, delete#

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

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

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