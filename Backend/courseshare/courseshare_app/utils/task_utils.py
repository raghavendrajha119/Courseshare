from ..models import Task

def calculate_pending_tasks(user, start_date, deadline, exclude_task_id=None):
    """
        Calculate the number of overlapping tasks in that range to train the model based on that data
        return count of overlapping incomplete tasks
    """
    qs = Task.objects.filter(
        user=user,
        completed_date__isnull=True,
        start_date__lte=deadline,
        deadline__gte=start_date
    )

    if exclude_task_id:
        qs = qs.exclude(id=exclude_task_id)

    return qs.count()

def update_pending_tasks_in_range(user, start_date, deadline):
    """
    Increment other_tasks_pending for all tasks in the given date range.
    """
    tasks_in_range = Task.objects.filter(
        user=user,
        completed_date__isnull=True,
        start_date__lte=deadline,
        deadline__gte=start_date
    )

    for task in tasks_in_range:
        task.other_tasks_pending = task.other_tasks_pending + 1
        task.save()