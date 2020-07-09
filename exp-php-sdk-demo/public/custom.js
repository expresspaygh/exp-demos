// init methods and listeners on page load
$(document).ready(function() {
  // handle events
  handleEvents();

  // print acitivities
  printToActivity("");
});

// handle events
const handleEvents = () => {
  // get elements
  let createInvoiceCheckbox = $("#createInvoiceCheckbox");
  let createInvoiceContainer = $("#createInvoiceContainer");
  let createInvoiceBtn = $("#createInvoiceBtn");
  let checkoutBtn = $("#checkoutBtn");

  // set events
  createInvoiceCheckbox.on("change", function() {
    if(this.checked) {
      createInvoiceContainer.removeClass("hidden");
      createInvoiceBtn.removeClass("hidden");
      checkoutBtn.addClass("hidden");
    } else {
      createInvoiceContainer.addClass("hidden");
      createInvoiceBtn.addClass("hidden");
      checkoutBtn.removeClass("hidden");
    }
  });
};

// print to activity view
const printToActivity = (text = "", style = "black-text") => {
  // get element
  let activityContainer = $("#activityContainer");

  // check and set data
  if (is.empty(text)) {
    // print
    activityContainer.append('<p class="' + style + '">- No context provided...</p>');
  } else {
    // print
    activityContainer.append('<p class="' + style + '">' + text + '</p>');
  }
};
