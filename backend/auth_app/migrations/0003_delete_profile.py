# Generated by Django 5.1.2 on 2024-12-10 12:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0002_profile_delete_customuser'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
