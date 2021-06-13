from django.contrib import admin
from core import models
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# For converting string to human readable text or for translation
from django.utils.translation import gettext as _

class UserAdmin(BaseUserAdmin):
    ordering = ['id']
    # list_display defines what fields to display in the preview page
    list_display = ['uid', 'email']
    # fieldsets variable defines sections and fields displayed in changing user page 
    fieldsets = (
        (None, {'fields': ('uid', 'email', 'password')}),
        (_('Personal Info'), {'fields': ('name',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')} ), 
        (_('Important dates'), {'fields': ('last_login',)} ),
    )
    # add_fieldsets variable defines sections and fields displayed in adding user page 
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')
        }), #<--- This comma is necessary ****
    )

admin.site.register(models.User, UserAdmin)
admin.site.register(models.Record)
admin.site.register(models.Insight)
admin.site.register(models.TriggerKeywordDefinition)
admin.site.register(models.TriggerKeywordFrequency)