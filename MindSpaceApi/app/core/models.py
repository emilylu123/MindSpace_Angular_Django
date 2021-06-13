from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save

# Recommended way to retreive settings
from django.conf import settings

# For computing trigger keywords frequency
import nltk
from nltk.tokenize import TweetTokenizer
# For stop words removal
nltk.download('stopwords')
from nltk.corpus import stopwords
# For lemmatization
nltk.download('wordnet')
from nltk import stem
# For counting
from collections import Counter

class UserManager(BaseUserManager):

    def create_user(self, uid, password, **extra_fields):
        """Creates and saves a new user using uid (from google) as username_field"""
        if not uid:
            raise ValueError('UID not passing')

        user = self.model(uid=uid, **extra_fields)
        user.set_password(password)
        if 'email' in extra_fields:
            user.email = self.normalize_email(extra_fields['email'])
        user.save(using=self._db)
        
        return user

    def create_superuser(self, uid, password):
        """Creates and saves a new super user using uid (from google) as username_field"""
        user = self.create_user(uid, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports uid and info returned from firebase"""
    uid = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, blank=True)
    name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'uid'

# Create your models here.
class Record(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    emotion = models.CharField(max_length=255)
    posted_date = models.DateField()
    post = models.TextField()
    
    # string representation
    def __str__(self):
        return self.emotion + ' (Posted on: ' + self.posted_date.strftime('%Y-%m-%d') + ')'

class Insight(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    reflection = models.TextField()
    posted_date = models.DateField()
    tag = models.CharField(max_length=255)
    
    # string representation
    def __str__(self):
        return self.tag + ' (Posted on: ' + self.posted_date.strftime('%Y-%m-%d') + ')'

class TriggerKeywordDefinition(models.Model):
    emotion = models.CharField(max_length=255)
    keyword = models.CharField(max_length=255)
    
    # string representation
    def __str__(self):
        return self.emotion + ' - ' + self.keyword 

class TriggerKeywordFrequency(models.Model):
    record = models.ForeignKey(
        Record, 
        on_delete=models.CASCADE
    )
    keyword = models.CharField(max_length=255)
    frequency = models.IntegerField()

    # string representation
    def __str__(self):
        return self.record.emotion + ' - ' + self.keyword + ' (' + str(self.frequency) + ')'


# Function for updating keyword freqency
def create_keyword_frequency_from_record(sender, instance, **kwargs):
    # Retrieve trigger keywords
    keywords = TriggerKeywordDefinition.objects.filter(emotion=instance.emotion)
    
    if len(keywords) > 0:
        tweet_tokenizer = TweetTokenizer()
        tokens = tweet_tokenizer.tokenize(instance.post)
        # Stop word removal
        filtered_tokens = []
        sw_set = set(stopwords.words('english'))
        for token in tokens:
            if token not in sw_set:
                filtered_tokens.append(token)
        # Lemmatization
        lemmatizer = stem.WordNetLemmatizer()
        filtered_tokens = [lemmatizer.lemmatize(token) for token in tokens]
        filtered_tokens_counter = Counter(filtered_tokens)
        for keywordObj in keywords:
            keyword = keywordObj.keyword
            lemmatized_keyword = lemmatizer.lemmatize(keyword)
            if lemmatized_keyword in filtered_tokens_counter:
                TriggerKeywordFrequency.objects.create(record=instance, keyword=keyword, frequency=filtered_tokens_counter[lemmatized_keyword])
        

post_save.connect(create_keyword_frequency_from_record, sender=Record)