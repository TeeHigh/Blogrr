from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)  # username
    full_name = models.CharField(max_length=100, blank=True)       # full name
    avatar = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    genres = models.JSONField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'               # login with email
    REQUIRED_FIELDS = ['username']         # username required for superuser

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return self.full_name or self.username  # fallback to username

class Blog(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'

    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300, null=True, blank=True)
    content = models.TextField()
    image = models.ImageField(upload_to='blogs/', null=True, blank=True)
    tag = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        return self.title
    



# class Tag(models.Model):
#     name = models.CharField(max_length=50, unique=True)

#     def __str__(self):
#         return self.name