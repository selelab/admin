# Generated by Django 3.0.4 on 2020-04-11 13:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0011_auto_20200411_1035'),
    ]

    operations = [
        migrations.RenameField(
            model_name='projectapproval',
            old_name='project_id',
            new_name='project',
        ),
        migrations.RenameField(
            model_name='purchase',
            old_name='project_id',
            new_name='project',
        ),
    ]
