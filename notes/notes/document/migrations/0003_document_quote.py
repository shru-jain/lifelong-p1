# Generated by Django 5.0.6 on 2024-05-15 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0002_auto_20200729_0442'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='quote',
            field=models.TextField(blank=True, null=True),
        ),
    ]