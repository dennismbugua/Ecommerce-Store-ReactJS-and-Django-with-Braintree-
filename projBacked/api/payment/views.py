from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

import braintree

# Create your views here.


gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        braintree.Environment.Sandbox,
        merchant_id="45zxhw3rm7vp3hkk",
        public_key="4mhmgz8s8wgd9ccx",
        private_key="96b4a717e70253f92c6d558e36d3930e"
    )
)


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
def generate_token(request, id, token):
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again!'})
    
    # Generate client token - let Braintree handle PayPal configuration automatically
    res = gateway.client_token.generate()
    return JsonResponse({'clientToken': res, 'success': True})


@csrf_exempt
def process_payment(request, id, token):
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again!'})

    try:
        import json
        
        # Parse JSON data if sent as JSON, otherwise use POST data
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST
        
        nonce_from_the_client = data["paymentMethodNonce"]
        amount_from_the_client = data["amount"]
        payment_method_type = data.get("paymentMethodType", "unknown")
        payment_details = data.get("paymentDetails", {})
        
        print("=== PAYMENT PROCESSING ===")
        print(f"Payment Method Type: {payment_method_type}")
        print(f"Nonce: {nonce_from_the_client}")
        print(f"Amount: {amount_from_the_client}")
        print(f"Payment Details: {payment_details}")
        print("========================")
        
        # Enhanced transaction data for Braintree
        transaction_data = {
            "amount": str(amount_from_the_client),
            "payment_method_nonce": nonce_from_the_client,
            "options": {
                "submit_for_settlement": True
            }
        }
        
        # Add PayPal specific options if it's a PayPal payment
        if payment_method_type == "PayPalAccount":
            transaction_data["options"]["paypal"] = {
                "payee_email": payment_details.get("paypalEmail"),
                "custom_field": f"Order for user {id}",
                "description": "EcoStore Purchase"
            }
            print("PayPal payment detected - adding PayPal options")
        
        # Process the transaction
        result = gateway.transaction.sale(transaction_data)
        
        print(f"Braintree Result Success: {result.is_success}")
        if result.is_success:
            transaction = result.transaction
            print(f"Transaction ID: {transaction.id}")
            print(f"Transaction Status: {transaction.status}")
            print(f"Payment Instrument Type: {transaction.payment_instrument_type}")
            
            # Prepare response with enhanced transaction data
            response_data = {
                "success": True,
                "transaction": {
                    "id": transaction.id,
                    "amount": str(transaction.amount),
                    "status": transaction.status,
                    "paymentInstrumentType": transaction.payment_instrument_type,
                    "currencyIsoCode": transaction.currency_iso_code,
                    "createdAt": transaction.created_at.isoformat() if transaction.created_at else None
                }
            }
            
            # Add PayPal specific data if available
            if hasattr(transaction, 'paypal_details') and transaction.paypal_details:
                paypal_details = transaction.paypal_details
                response_data["transaction"]["paypal"] = {
                    "payerEmail": paypal_details.payer_email if hasattr(paypal_details, 'payer_email') else None,
                    "payerId": paypal_details.payer_id if hasattr(paypal_details, 'payer_id') else None,
                    "authorizationId": paypal_details.authorization_id if hasattr(paypal_details, 'authorization_id') else None,
                    "captureId": paypal_details.capture_id if hasattr(paypal_details, 'capture_id') else None
                }
                print(f"PayPal Details Added: {response_data['transaction']['paypal']}")
            
            print(f"Success Response: {response_data}")
            return JsonResponse(response_data)
        else:
            error_messages = []
            if result.errors:
                for error in result.errors.deep_errors:
                    error_messages.append(f"{error.code}: {error.message}")
            
            error_response = {
                'error': True, 
                'success': False,
                'message': '; '.join(error_messages) if error_messages else 'Payment processing failed',
                'braintree_errors': error_messages
            }
            print(f"Error Response: {error_response}")
            return JsonResponse(error_response)
            
    except Exception as e:
        print(f"Payment processing exception: {str(e)}")
        return JsonResponse({
            'error': True, 
            'success': False,
            'message': f'Payment processing error: {str(e)}'
        })

