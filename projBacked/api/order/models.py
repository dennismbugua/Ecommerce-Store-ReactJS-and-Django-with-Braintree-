from django.db import models
from ..user.models import CustomUser
from ..product.models import Product

# Create your models here.


class Order(models.Model):
    PAYMENT_METHODS = [
        ('Card', 'Credit/Debit Card'),
        ('PayPalAccount', 'PayPal'),
        ('Venmo', 'Venmo'),
        ('ApplePay', 'Apple Pay'),
        ('GooglePay', 'Google Pay'),
        ('unknown', 'Unknown'),
    ]
    
    TRANSACTION_STATUSES = [
        ('authorized', 'Authorized'),
        ('settled', 'Settled'),
        ('settlement_pending', 'Settlement Pending'),
        ('failed', 'Failed'),
        ('voided', 'Voided'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True
    )
    product_names = models.CharField(max_length=500)
    total_products = models.CharField(max_length=500, default=0)
    transaction_id = models.CharField(max_length=150, default=0)
    total_amount = models.CharField(max_length=50, default=0)
    
    # Enhanced payment tracking fields
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHODS, default='Card')
    transaction_status = models.CharField(max_length=50, choices=TRANSACTION_STATUSES, default='settled')
    currency_code = models.CharField(max_length=10, default='USD')
    
    # PayPal specific fields
    paypal_payer_email = models.EmailField(blank=True, null=True)
    paypal_payer_id = models.CharField(max_length=100, blank=True, null=True)
    paypal_authorization_id = models.CharField(max_length=100, blank=True, null=True)
    paypal_capture_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Additional tracking
    payment_processor_response = models.TextField(blank=True, null=True)  # Store full response for debugging

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Order #{self.id} - {self.user.email if self.user else 'Unknown'} - {self.payment_method} - ${self.total_amount}"
    
    @property
    def is_paypal_payment(self):
        return self.payment_method == 'PayPalAccount'
    
    @property
    def formatted_amount(self):
        return f"${self.total_amount} {self.currency_code}"