from django.contrib.auth.models import User

# Get the reading level of a text using Coleman Liau index
def reading_level(text):
    # Formula: 0.0588 * L - 0.296 * S - 15.8
    # L is the average number of letters per 100 words in the text
    # S is the average number of sentences per 100 words in the text

    # Count letter
    letter_count = 0
    for s in text:
        if s.isalpha():
            letter_count += 1

    # Count word
    word_count = len(text.split())

    # Count sentences
    sentence_count = len(text.replace("!", ".").replace("?", ".").split(".")) - 1

    L = letter_count / word_count * 100
    S = sentence_count / word_count * 100

    index = round(0.0588 * L - 0.296 * S - 15.8)
    if index <= 3:
        return 1
    elif index <= 7:
        return 2
    else:
        return 3



def get_rank(user):
    users = User.objects.order_by('profile__score').all()
    for i, u in enumerate(users):
        if u == user:
            return i + 1 