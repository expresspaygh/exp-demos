// init methods and listeners on page load
$(document).ready(function() {
  // initialize
  init()
})

// initialize
const init = () => {
  let date = new Date()
  let dateElement = $("#currentYear")
  let submitButton = $("#submitInvoiceBtn")

  submitButton.on('click', function () {
    handleSubmitRequest()
  })

  dateElement.html(date.getFullYear())
}

// generate random string
const randomString = (len, charSet = "") => {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}

// get GET request variable
const getRequestVariable = (name) => {
  if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
    return decodeURIComponent(name[1]);
  }
}

// print query request error response
const printGenericQueryErrorResponse = (queryHeader, queryIcon, queryText, message, orderId) => {
  queryHeader.html('<h3>Sorry!</h3><p><b>(' + orderId + ')</b></p><br>')
  queryIcon.html('<i class="large material-icons red-text">close</i>')
  queryText.html(message)
}

// handle submit request
const handleSubmitRequest = () => {
  const checkoutButton = $("#checkoutBtn")
  const formContainer = $("#formContainer")
  const checkoutContainer = $("#checkoutContainer")

  let firstName = $("#payFirstname").val()
  let lastName = $("#payLastname").val()
  let phoneNumber = $("#payPhonenumber").val()
  let email = $("#payEmail").val()
  let accNumber = $("#payAccNumber").val()
  let orderDesc = $("#payOrderDesc").val()
  let amount = $("#payAmount").val()
  let currency = $("#payCurrency").val()

  axios.post('../api/pay.php', {
    request: "submit",
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    email: email,
    account_number: accNumber,
    order_description: orderDesc,
    amount: amount,
    order_id: randomString(10),
    currency: currency
  }).then(function (response) {

    if (response.data.status !== 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: response.data.message,
        footer: '<a href="https://expresspaygh.com">expressPay</a>'
      })
    }

    formContainer.addClass('hidden')
    checkoutContainer.removeClass('hidden')

    checkoutButton.on('click', function () {
      handleCheckoutRequest(response.data.output['token'])
    })

    Swal.fire({
      icon: 'success',
      title: 'Awesome',
      text: response.data.message,
      footer: '<a href="https://expresspaygh.com">expressPay</a>'
    })

  }).catch(function (error) {
    console.log(error);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!, kindly check your console log',
      footer: '<a href="https://expresspaygh.com">expressPay</a>'
    })
  });
}

// handle checkout request
const handleCheckoutRequest = (token) => {
  const checkoutButton = $("#checkoutBtn")

  checkoutButton.html("Loading...")
  checkoutButton.addClass("disabled")

  axios.post('../api/pay.php', {
    request: "checkout",
    token: token,
  }).then(function (response) {

    if (response.data.status !== 0) {
      checkoutButton.html("Yes, Proceed")
      checkoutButton.removeClass("disabled")
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: response.data.message,
        footer: '<a href="https://expresspaygh.com">expressPay</a>'
      })
    }

    Swal.fire({
      icon: 'info',
      title: 'Redirecting!',
      text: "Kindly confirm to proceed",
      footer: '<a href="https://expresspaygh.com">expressPay</a>'
    })

    setTimeout(function() {
      window.location.href = response.data.output[0];
    }, 5000)

  }).catch(function (error) {
    console.log(error);

    const checkoutButton = $("#checkoutBtn")
    checkoutButton.html("Yes, Proceed")
    checkoutButton.removeClass("disabled")

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!, kindly check your console log',
      footer: '<a href="https://expresspaygh.com">expressPay</a>'
    })
  });
}

// handle query request
const handleQueryRequest = () => {
  const queryIcon = $("#queryIcon")
  const queryText = $("#queryText")
  const homeButton = $("#homeButton")
  const queryHeader = $("#queryHeader")
  const restartButton = $("#restartButton")

  let token = getRequestVariable('token')
  let order_id = getRequestVariable('order-id')

  if (!token) {
    queryText.html('<p class="flow-text">No token found!</p>')
    restartButton.html("Try again")
  } 
  else if (!order_id) {
    queryText.html('<p class="flow-text">No order-id found!</p>')
    restartButton.html("Try again")
  } 
  else {
    axios.post('../api/pay.php', {
      request: "query",
      token: token,
    }).then(function (response) {
  
      if (response.data.status !== 0 || !response.data.output) {
        let failedMsg = response.data.message + ", click (Try again) to retry"
        printGenericQueryErrorResponse(queryHeader, queryIcon, queryText, failedMsg, order_id)
        restartButton.html("Try again")
      }
  
      if (parseInt(response.data.output['result']) === 3 || parseInt(response.data.output['result']) === 4) {
        queryHeader.html('<h3>Note!</h3><p><b>(' + order_id + ')</b></p><br>')
        queryIcon.html('<i class="large material-icons blue-text">priority_high</i>')
        queryText.html(response.data.output['result-text'] + ", click the link below to check again")

        restartButton.html("Reload window")
        restartButton.attr("href", "")

        homeButton.removeClass("hidden")
      } 
      else if (parseInt(response.data.output['result']) === 2) {
        printGenericQueryErrorResponse(queryHeader, queryIcon, queryText, response.data.output['result-text'], order_id)
        restartButton.html("Try again")
      } 
      else {
        queryHeader.html('<h3>Great!</h3><p><b>(' + order_id + ')</b></p><br>')
        queryIcon.html('<i class="large material-icons green-text">check</i>')
        queryText.html(response.data.output['result-text'])
        restartButton.html("Go home")
      }
  
    }).catch(function (error) {
      console.log(error);
  
      let genericMsg = "Something went wrong!, kindly check your console log"
      printGenericQueryErrorResponse(queryHeader, queryIcon, queryText, genericMsg, order_id)
      restartButton.html("Try again")
    });
  }
}
