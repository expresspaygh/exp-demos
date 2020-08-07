<?php

ini_set("error_log", "api.log");
require_once(dirname(__FILE__) . "/../vendor/autoload.php");

use Exception;
use Dotenv\Dotenv;
use Expay\Logger\Log;
use Rakit\Validation\Validator;
use Expay\SDK\MerchantApi as ExpMerchantApi;

/**
 * PayApi
 */
class PayApi
{  
  /**
   * merchant_id
   *
   * @var string
   */
  private $merchant_id = "";  
  /**
   * merchant_key
   *
   * @var string
   */
  private $merchant_key = "";  
  /**
   * request
   *
   * @var array
   */
  private $request = array();  
  /**
   * redirect_url
   *
   * @var string
   */
  private $redirect_url = "";  
  /**
   * order_img_url
   *
   * @var string
   */
  private $order_img_url = "";  
  /**
   * app_env
   *
   * @var string
   */
  private $app_env = "";
    
  /**
   * __construct
   *
   * @param  mixed $request
   * @return void
   */
  public function __construct(array $request)
  {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $this->request = $request;

    $this->merchant_id = $_ENV["EXP_MERCHANT_ID"];
    $this->merchant_key = $_ENV["EXP_MERCHANT_KEY"];

    $this->app_env = $_ENV["APP_ENV"];
    $this->order_img_url = $_ENV["APP_LOGO_URL"];
    $this->redirect_url = $_ENV["APP_REDIRECT_URL"];
  }
  
  /**
   * responder
   *
   * @param  mixed $status
   * @param  mixed $message
   * @param  mixed $output
   * @return array
   */
  private function responder(int $status, string $message, array $data = null) : array
  {
    $output = array();

    $output["status"] = $status;
    $output["message"] = $message;
    if (!is_null($data)) $output["output"] = $data;

    return $output;
  }
  
  /**
   * submit
   *
   * @return array
   */
  private function submit() : array
  {
    unset($this->request["request"]);

    $validator = new Validator;
    $validation = $validator->validate($this->request, [
      "currency" => "required|present",
      "amount" => "required|present|numeric",
      "order_id" => "required|present",
      "order_description" => "required|present",
      "account_number" => "required|present",
      "first_name" => "required|present",
      "last_name" => "required|present",
      "phone_number" => "required|present|min:10|max:14",
      "email" => "required|present|email"
    ]);
    if ($validation->fails()) {
      // handling errors
      $errors = $validation->errors();
      return $this->responder(1, current($errors->all()));
    }

    $merchantApi = new ExpMerchantApi($this->merchant_id, $this->merchant_key, $this->app_env);
    
    $response = $merchantApi->submit(
      $this->request["currency"],
      $this->request["amount"],
      $this->request["order_id"],
      $this->request["order_description"],
      $this->redirect_url,
      $this->request["account_number"],
      $this->order_img_url,
      $this->request["first_name"],
      $this->request["last_name"],
      $this->request["phone_number"],
      $this->request["email"]
    );

    Log::info($response,true);
    
    return $this->responder(0, 'Success', $response);
  }

  /**
   * checkout
   *
   * @return array
   */
  private function checkout() : array
  {
    $merchantApi = new ExpMerchantApi($this->merchant_id, $this->merchant_key, $this->app_env);

    $response = $merchantApi->checkout(
      $this->request["token"]
    );

    Log::info($response,true);

    return $this->responder(0, 'Success', [$response]);
  }
  
  /**
   * query
   *
   * @return array
   */
  private function query() : array
  {
    unset($this->request["request"]);

    $merchantApi = new ExpMerchantApi($this->merchant_id, $this->merchant_key, $this->app_env);
    $response = $merchantApi->query(
      $this->request["token"]
    );

    Log::info($response,true);
    
    return $this->responder(0, 'Success', $response);
  }
  
  /**
   * handle
   *
   * @return array
   */
  public function handle() : ?array
  {
    if (!empty($this->request))
    {
      $request = $this->request["request"];
      unset($this->request["request"]);

      if ($request == "submit") {
        return $this->submit();
      } elseif ($request == "checkout") {
        return $this->checkout();
      } elseif ($request == "query") {
        return $this->query();
      } else {
        return $this->responder(1, "Sorry, unknown request");
      }
    } else {
      return $this->responder(1, "Sorry, request cannot be empty");
    }
  }
}

// try catch
try {

  // check request type
  if ($_SERVER['REQUEST_METHOD'] != "POST")
  {
    echo json_encode([
      "status" => 1,
      "message" => "Request type POST expected"
    ]);
  } else {
    $data = json_decode(file_get_contents("php://input"), true);

    $payApi = (new PayApi($data))->handle();
    
    Log::info($payApi,true);

    echo json_encode($payApi);
  }

} catch(Exception $e) {
  // log
  Log::info($e->getMessage(),true);

  echo json_encode($e->getMessage());
}

// close
exit;
