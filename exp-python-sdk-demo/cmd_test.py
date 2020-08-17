from expay_sdk import merchant_api

"""
Init keys
"""
environment = "sandbox"
merchant_id = "089237783227"
merchant_key = "JKR91Vs1zEcuAj9LwMXQu-H3LPrDq1XCKItTKpmLY1-XsBgCnNpkDT1GER8ih9f-UTYoNINatMbreNIRavgu-89wPOnY6F7mz1lXP3LZ"

"""
Init import classes
"""
merchant_api_class = merchant_api.MerchantApi(merchant_id, merchant_key, environment)

"""
Token reference for checkout and query request
"""
_token = ""

"""
Print to screen
"""
def printer(value: str, header: str = None) -> None:
  print("----------------------------------------")
  if header is not None:
    print(header + "\n")
  print(value)
  print("----------------------------------------")
  print("\n")

"""
Test Object Representation
"""
def test_repr():
  _repr = repr(merchant_api_class)
  printer(_repr, "MERCHANT CLASS REPR:")

"""
Test String Representation
"""
def test_str():
  _str = str(merchant_api_class)
  printer(_str)

"""
Test init
"""
def test_init():
  printer(merchant_api_class.allowed_envs)
  printer(merchant_api_class.base_url)

"""
Test submit request
"""
def test_submit():
  merchant_submit = merchant_api_class.submit(
    currency="GHS",
    amount=20.00,
    order_id="78HJU789UYTR",
    order_desc="Buy Airtime",
    redirect_url="https://www.expresspaygh.com",
    account_number="1234567890",
    order_img_url="https://expresspaygh.com/images/logo.png",
    first_name="Jeffery",
    last_name="Osei",
    phone_number="233545512042",
    email="jefferyosei@expresspaygh.com"
  )

  global _token
  _token = merchant_submit['token']

  printer(merchant_submit, "MERCHANT SUBMIT:")

"""
Test checkout request
"""
def test_checkout():
  merchant_checkout = merchant_api_class.checkout(_token)

  printer(merchant_checkout, "MERCHANT CHECKOUT:")

"""
Test query request
"""
def test_query():
  merchant_query = merchant_api_class.query(_token)
  printer(merchant_query, "MERCHANT QUERY:")

"""
Callables
"""
test_repr()
test_str()
test_init()
test_submit()
test_checkout()
test_query()