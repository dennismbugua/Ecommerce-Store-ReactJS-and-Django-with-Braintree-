from django.contrib import admin
from django import forms

# Global admin configuration to disable autocomplete

# Custom base admin class that can be inherited by all admin classes
class NoAutocompleteAdminMixin:
    """
    Mixin to disable autocomplete on all form fields
    """
    class Media:
        css = {
            'all': ('admin/css/disable_autocomplete.css',)
        }
        js = ('admin/js/disable_autocomplete.js',)

# Base admin form that disables autocomplete on all fields
class NoAutocompleteModelForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Apply autocomplete=off to all form fields
        for field_name, field in self.fields.items():
            if hasattr(field.widget, 'attrs'):
                field.widget.attrs.update({
                    'autocomplete': 'off',
                    'autocapitalize': 'off',
                    'autocorrect': 'off',
                    'spellcheck': 'false',
                    'data-lpignore': 'true',  # LastPass ignore
                    'data-form-type': 'other'  # Browser form detection
                })

# Configure the admin site
admin.site.site_header = 'EcoStore Administration'
admin.site.site_title = 'EcoStore Admin'
admin.site.index_title = 'Welcome to EcoStore Administration'
