(function () {
  document.forms.register.noValidate = true;
  $('form').on('submit', function (e) {      // When form is submitted
    var elements = this.elements;
    var valid = {};
    var isValid;                             // isValid: checks form controls
    var isFormValid;                         // isFormValid: checks entire form


    var i;
    for (i = 0, l = elements.length; i < l; i++) {

      isValid = validateRequired(elements[i]) && validateTypes(elements[i]);
      if (!isValid) {                    // If it does not pass these two tests
        showErrorMessage(elements[i]);   // Show error messages
      } else {                           // Otherwise
        removeErrorMessage(elements[i]); // Remove error messages
      }                                  // End if statement
      valid[elements[i].id] = isValid;   // Add element to the valid object
    }                                    // End for loop


    // bio
    if (!validateBio()) {                // Call validateBio(), and if not valid
      showErrorMessage(document.getElementById('bio')); // Show error message
      valid.bio = false;                 // Update valid object - this element is not valid
    } else {                             // Otherwise remove error message
      removeErrorMessage(document.getElementById('bio'));
    }

    // password
    if (!validatePassword()) {          // Call validatePassword(), and if not valid
      showErrorMessage(document.getElementById('password')); // Show error message
      valid.password = false;           // Update the valid object - this element is not valid
    } else {                            // Otherwise remove error message
      removeErrorMessage(document.getElementById('password'));
    }




    for (var field in valid) {          // Check properties of the valid object
      if (!valid[field]) {              // If it is not valid
        isFormValid = false;            // Set isFormValid variable to false
        break;                          // Stop the for loop, an error was found
      }                                 // Otherwise
      isFormValid = true;               // The form is valid and OK to submit
    }



    if (!isFormValid) {                 // If isFormValid is not true
      e.preventDefault();               // Prevent the form being submitted
    }

  });                                   // End of event handler anon function


  function validateRequired(el) {
    if (isRequired(el)) {                           // Is this element required?
      var valid = !isEmpty(el);                     // Is value not empty (true / false)?
      if (!valid) {                                 // If valid variable holds false
        setErrorMessage(el,  'Field is required');  // Set the error message
      }
      return valid;                                 // Return valid variable (true or false)?
    }
    return true;                                    // If not required, all is ok
  }



  function isRequired(el) {
   return ((typeof el.required === 'boolean') && el.required) ||
     (typeof el.required === 'string');
  }


  function isEmpty(el) {
    return !el.value || el.value === el.placeholder;
  }


  function validateTypes(el) {
    if (!el.value) return true;                     // If element has no value, return true
                                                    // Otherwise get the value from .data()
    var type = $(el).data('type') || el.getAttribute('type');  // OR get the type of input
    if (typeof validateType[type] === 'function') { // Is the type a method of validate object?
      return validateType[type](el);                // If yes, check if the value validates
    } else {                                        // If not
      return true;                                  // Return true because it cannot be tested
    }
  }




  // Check if the bio is less than or equal to 140 characters
  function validateBio() {
    var bio = document.getElementById('bio');
    var valid = bio.value.length <= 140;
    if (!valid) {
      setErrorMessage(bio, 'Please make sure your bio does not exceed 140 characters');
    }
    return valid;
  }



  // Check that the passwords both match and are 8 characters or more
  function validatePassword() {
    var password = document.getElementById('password');

    var valid = password.value.length >= 8;

    if (!valid) {
      $("#image2").show();
      setErrorMessage(password, 'Please make sure your password has at least 8 characters');
    }
    return valid;
  }




  function setErrorMessage(el, message) {
    $(el).data('errorMessage', message);                 // Store error message with element
  }

  function getErrorMessage(el) {
    return $(el).data('errorMessage') || el.title;       // Get error message or title of element
  }

  function showErrorMessage(el) {
    var $el = $(el);                                     // The element with the error
    var errorContainer = $el.siblings('.error.message'); // Any siblings holding an error message

    if (!errorContainer.length) {                         // If no errors exist with the element
       // Create a <span> element to hold the error and add it after the element with the error
       errorContainer = $('<span class="error message"></span>').insertAfter($el);
    }
    errorContainer.text(getErrorMessage(el));             // Add error message
  }

  function removeErrorMessage(el) {
    var errorContainer = $(el).siblings('.error.message'); // Get the sibling of this form control used to hold the error message
    errorContainer.remove();                               // Remove the element that contains the error message
  }




  // Checks whether data is valid, if not set error message
  // Returns true if valid, false if invalid
  var validateType = {
    email: function (el) {                                 // Create email() method
      //  regular expression that checks for a single @ in the email
      var valid = /[^@]+@[^@]+/.test(el.value);            // Store result of test in valid
      if (!valid) {                                        // If the value of valid is not true
        setErrorMessage(el, 'Please enter a valid email'); // Set error message
      }
      return valid;                                        // Return the valid variable
    },
    number: function (el) {                                // Create number() method
      var valid = /^\d+$/.test(el.value);                  // Store result of test in valid
      if (!valid) {
        setErrorMessage(el, 'Please enter a valid number');
      }
      return valid;
    },
    date: function (el) {                                  // Create date() method
                                                           // Store result of test in valid
      var valid = /^(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})$/.test(el.value);
      if (!valid) {                                        // If the value of valid is not true
        setErrorMessage(el, 'Please enter a valid date');  // Set error message
      }
      return valid;                                        // Return the valid variable
    }
  };

}());
