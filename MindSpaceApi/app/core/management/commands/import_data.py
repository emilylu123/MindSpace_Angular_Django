from core.models import Record, TriggerKeywordDefinition
import csv
from django.core.management.base import BaseCommand
import os
from django.contrib.auth import get_user_model
from datetime import datetime 

class Command(BaseCommand):
    """Django command to load csv file into database"""

    def handle(self, *args, **options):
        # Delete all emotion records and trigger keywords definition first
        Record.objects.all().delete()
        TriggerKeywordDefinition.objects.all().delete()
        
        # Hardcode testing user ID
        u1 = get_user_model().objects.get(uid=os.environ.get('U1_UID'))
        u2 = get_user_model().objects.get(uid=os.environ.get('U2_UID'))

        with open('trigger_keywords.csv', encoding='ISO-8859-1') as keywordfile:
            reader = csv.reader(keywordfile, delimiter=',')
            for row in reader:
                if (row[0] != 'Emotion'): #To check if it is a header row
                    keywords = [keyword.strip() for keyword in row[1].split(',')]
                    for keyword in keywords:
                        TriggerKeywordDefinition.objects.create(emotion=row[0], keyword=keyword)
        
        with open('mindspace_dataset.csv', encoding='ISO-8859-1') as datafile:
            reader = csv.reader(datafile, delimiter=',')
            for row in reader:
                if (row[2] != 'PostedDate'): #To check if it is a header row
                    posted_date = datetime.strptime(row[2], '%Y-%m-%d').date()
                    if row[0] == 'U1':
                        Record.objects.create(user=u1,emotion=row[1],posted_date=posted_date,post=row[3])
                    else:
                        Record.objects.create(user=u2,emotion=row[1],posted_date=posted_date,post=row[3])
                