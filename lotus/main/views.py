from django.views.generic import ListView, DeleteView
from .models import ProductItem, Category, Volume
from django.db.models import Q


class CatologView(ListView):
    model = ProductItem
    template_name = 'main/product/list.html'
    context_object_name = 'product_name'


    def get_queryset(self):
        queryset = super().get_queryset()
        category_slugs = self.request.GET.getlist('category')
        volume_name = self.request.GET.getlist('volume')
        min_price = self.request.GET.get('minprice')
        max_price = self.request.GET.get('maxprice')


        if category_slugs:
            queryset = queryset.filter(category__slug__in=category_slugs)

        if volume_name:
            queryset= queryset.filter(
                Q(volumes__name__in=volume_name) & Q(volumes__productitemvolume__available=True)
            ) 
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset
    
    def  get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        context['volumes'] = Volume.objects.all()
        context['selected_categories'] = self.request.GET.getlist('category')
        context['selected_volumes'] = self.request.GET.getlist('volume')
        context['min_price'] = self.request.GET.getlist('min_price', '')
        context['max_price'] = self.request.GET.getlist('max_price', '')
        return context
    

    
