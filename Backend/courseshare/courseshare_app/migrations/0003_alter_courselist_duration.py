# Generated by Django 5.2.4 on 2025-07-22 03:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courseshare_app', '0002_courselist_category_courselist_level'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courselist',
            name='Duration',
            field=models.DurationField(blank=True, null=True),
        ),
    ]
