from .course_views import (
    CourseListView,
    CourseListFilterView,
    CourseListEduView,
    CourseDetailView,
)
from .enrollment_views import (
    EnrollCourseView,
    EnrolledCoursesView,
)
from .video_views import (
    AddVideosToCourseView
)
from .payment_views import (
    StripeCheckoutSessionAPIView,
)
from .tasks_views import (
    TaskListCreateView,
    TaskUpdateCompleteView,
    TaskUpdateView,
    TaskDeleteView,
)