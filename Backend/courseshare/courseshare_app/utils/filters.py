from django_filters import rest_framework as filters
from ..models import CourseList

class CourseFilter(filters.FilterSet):
    price = filters.NumberFilter(field_name="Coursefee", lookup_expr='exact')
    price_lte = filters.NumberFilter(field_name="Coursefee", lookup_expr='lte')
    price_gte = filters.NumberFilter(field_name="Coursefee", lookup_expr='gte')
    category = filters.CharFilter(field_name="category", lookup_expr='iexact')
    level = filters.CharFilter(field_name="level", lookup_expr='iexact')

    class Meta:
        model = CourseList
        fields = ['price', 'price_lte', 'price_gte', 'category', 'level']
