from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("datasets", "0005_alter_dataset_options"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="validationreport",
            name="consistency_score",
        ),
    ]
