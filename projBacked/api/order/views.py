from rest_framework import viewsets
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .serializers import OrderSerializer
from .models import Order
from django.views.decorators.csrf import csrf_exempt

# Create your views here.


def validate_user_session(id, token):
    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(pk=id)
        if user.session_token == token:
            return True
        return False
    except UserModel.DoesNotExist:
        return False

@csrf_exempt
def add(request, id, token):
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Please re-login', 'code': '1'})

    if request.method == "POST":
        try:
            import json
            
            # Parse JSON data if sent as JSON, otherwise use POST data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST
            
            user_id = id
            transaction_id = data['transaction_id']
            amount = data['amount']
            products = data['products']
            
            # Enhanced fields for better order tracking
            payment_method = data.get('payment_method', 'Card')
            transaction_status = data.get('transaction_status', 'settled')
            currency_code = data.get('currency_code', 'USD')
            
            # PayPal specific fields
            paypal_payer_email = data.get('paypal_payer_email', '')
            paypal_payer_id = data.get('paypal_payer_id', '')
            paypal_authorization_id = data.get('paypal_authorization_id', '')
            paypal_capture_id = data.get('paypal_capture_id', '')
            
            # Product details if available
            product_details = data.get('product_details', [])
            
            print("=== ORDER CREATION ===")
            print(f"User ID: {user_id}")
            print(f"Transaction ID: {transaction_id}")
            print(f"Payment Method: {payment_method}")
            print(f"Amount: {amount} {currency_code}")
            print(f"Products: {products}")
            if payment_method == 'PayPalAccount':
                print(f"PayPal Email: {paypal_payer_email}")
                print(f"PayPal Payer ID: {paypal_payer_id}")
            print("===================")

            total_pro = len(products.split(',')[:-1]) if isinstance(products, str) else len(product_details)

            UserModel = get_user_model()

            try:
                user = UserModel.objects.get(pk=user_id)
            except UserModel.DoesNotExist:
                return JsonResponse({'error': 'User does not exist'})

            # Create order with enhanced data
            ordr = Order(
                user=user, 
                product_names=products, 
                total_products=total_pro,
                transaction_id=transaction_id, 
                total_amount=amount
            )
            
            # Add PayPal fields if they exist in the model
            if hasattr(ordr, 'payment_method'):
                ordr.payment_method = payment_method
            if hasattr(ordr, 'transaction_status'):
                ordr.transaction_status = transaction_status
            if hasattr(ordr, 'currency_code'):
                ordr.currency_code = currency_code
            if hasattr(ordr, 'paypal_payer_email') and paypal_payer_email:
                ordr.paypal_payer_email = paypal_payer_email
            if hasattr(ordr, 'paypal_payer_id') and paypal_payer_id:
                ordr.paypal_payer_id = paypal_payer_id
            
            ordr.save()
            
            # Prepare success response
            response_data = {
                'success': True, 
                'error': False, 
                'msg': f'Order placed successfully via {payment_method}',
                'order_id': ordr.id,
                'transaction_id': transaction_id,
                'payment_method': payment_method
            }
            
            if payment_method == 'PayPalAccount' and paypal_payer_email:
                response_data['paypal_email'] = paypal_payer_email
            
            print(f"Order created successfully: {response_data}")
            return JsonResponse(response_data)
            
        except Exception as e:
            print(f"Order creation error: {str(e)}")
            return JsonResponse({
                'error': True, 
                'success': False,
                'msg': f'Order creation failed: {str(e)}'
            })


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('id')
    serializer_class = OrderSerializer
