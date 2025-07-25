from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'is_admin', 'is_staff')
    search_fields = ('email', 'name')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {'fields': ('email', 'name', 'password')}),
        ('Permissions', {'fields': ('is_admin', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Personal', {'fields': ('tc', 'profile_image', 'bio', 'dob')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'tc', 'password1', 'password2'),
        }),
    )

    ordering = ('email',)

admin.site.register(User, UserAdmin)
