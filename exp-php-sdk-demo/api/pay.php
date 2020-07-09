<?php

ini_set("error_log", "api.log");
require_once(dirname(__FILE__) . "/../vendor/autoload.php");

use Exception;
use Dotenv\Dotenv;
use Expay\SDK\MerchantApi;

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
   * __construct
   *
   * @param  mixed $request
   * @return void
   */
  public function __construct(array $request)
  {
    // load env variables
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $this->merchant_id = getenv("MERCHANT_ID");
    $this->merchant_key = getenv("MERCHANT_KEY");

    $this->request = $request;

    $this->redirect_url = "http://jefferyosei.expresspaygh.com/exp-php-sdk-demo/public/pay.html";
    $this->order_img_url = "https://expresspaygh.com/images/logo.png";
  }
  
  /**
   * responder
   *
   * @param  mixed $status
   * @param  mixed $message
   * @param  mixed $output
   * @return array
   */
  private function responder(int $status, string $message, array $output = null) : array
  {
    $output = array();

    $output["status"] = $status;
    $output["message"] = $message;
    if (!is_null($output)) $output["output"] = $output;

    return $output;
  }
    
  /**
   * create_invoice
   *
   * @return array
   */
  private function create_invoice() : array
  {
    unset($this->request["request"]);

    $merchantApi = new MerchantApi($this->merchant_id, $this->merchant_key, "sandbox");
    $response = $merchantApi->create_invoice(
      $this->request["order_id"],
      $this->request["currency"],
      $this->request["amount"],
      $this->request["account_number"],
      $this->request["order_desc"],
      $this->request["account_name"],
      $this->request["phone_number"],
      $this->request["email"],
      $this->redirect_url
    );
    
    return (array) $response;
  }
  
  /**
   * submit
   *
   * @return array
   */
  private function submit() : array
  {
    unset($this->request["request"]);

    $merchantApi = new MerchantApi($this->merchant_id, $this->merchant_key, "sandbox");
    $response = $merchantApi->submit(
      $this->request["currency"],
      $this->request["amount"],
      $this->request["order_id"],
      $this->request["order_desc"],
      $this->redirect_url,
      $this->request["account_number"],
      $this->order_img_url,
      $this->request["first_name"],
      $this->request["phone_number"],
      $this->request["email"]
    );
    
    return (array) $response;
  }
  
  /**
   * run_request
   *
   * @return array
   */
  public function request() : ?array
  {
    if (!empty($this->request))
    {
      if ($this->request["request"] == "create_invoice") {
        return $this->create_invoice();
      } elseif ($this->request["request"] == "submit") {
        return $this->submit();
      } elseif ($this->request["token"] && !isset($this->request["request"])) {
        return $this->query($this->request["token"]);
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
    $payApi = new PayApi($_POST);
    echo json_encode($payApi->request());
  }

} catch(Exception $e) {
  echo json_encode($e->getMessage());
}

// close
exit;
