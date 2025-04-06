from django.db import models


class Volume(models.Model):
    num_value = models.DecimalField(max_digits=6, decimal_places=2)
    unit = models.CharField(max_length=5, default='ml') 


    def __str__(self):
        return f"{self.num_value} {self.unit}"


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True)


    def __str__(self):
        return self.name
    

    class Meta:
        ordering = ['name']
        indexes = [models.Index(fields=['name'])]
        verbose_name = 'category'
        verbose_name_plural = 'categories'

class ProductItem(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    available = models.BooleanField(default=True)
    sizes = models.ManyToManyField(Volume, through='ProductItemVol', 
                                   related_name='product_item', blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, 
                                 related_name='product_item')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name
    

    def get_price_with_discount(self):
        if self.discount > 0:
            return self.price * (1 - (self.discount / 100))
        return self.price
    
class ProductItemVol(models.Model):
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE)
    volume = models.ForeignKey(Volume, on_delete=models.CASCADE)
    available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('product_item', 'volume')