from django.contrib.auth.models import User

# Get user rank


def get_rank(user):
    users = User.objects.order_by('-profile__score').all()
    for i, u in enumerate(users):
        if u == user:
            return i + 1
