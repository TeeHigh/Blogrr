from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class CaseInsensitiveUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        return None
