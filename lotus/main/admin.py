from django.contrib import admin
from .models import Volume, Category, \
    ProductItem, ProductItemVol


class ProductItemVolInline(admin.TabularInline):
    model = ProductItemVol
    extra = 4

@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    list_display = ('num_value', 'unit')
    search_fields = ('num_value', 'unit')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 
                    'available', 'price', 'discount',
                      'created_at', 'updated_at')
    list_filter =  ('available', 'category')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-created_at',)
    inlines = [ProductItemVolInline]