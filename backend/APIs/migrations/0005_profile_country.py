# Generated by Django 5.1.2 on 2024-12-10 12:39

import django_countries.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('APIs', '0004_remove_profile_country'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='country',
            field=django_countries.fields.CountryField(blank=True, max_length=2, null=True),
        ),
    ]
