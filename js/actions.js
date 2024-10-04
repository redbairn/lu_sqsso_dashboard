// Initialize all tooltips on the page
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


// Function to dynamically open modal for different actions
function openModal(action) {
  const modalTitle = document.getElementById('loginModalLabel');
  const enrollmentField = document.getElementById('enrollmentIdField');
  const nameFields = document.querySelectorAll('.name-fields');
  
  
  // Reset the form and hide additional fields
  resetForm();
  
  // Set the modal title and handle additional fields
  if (action === 'Basic Login') {
      modalTitle.textContent = 'Basic Login';
      enrollmentField.classList.add('d-none');
      nameFields.forEach(field => field.classList.remove('d-none')); // Show name fields
  } else if (action === 'Enrollment') {
      modalTitle.textContent = 'Enrollment';
      enrollmentField.classList.remove('d-none'); // Show Enrollment ID field
      nameFields.forEach(field => field.classList.add('d-none')); // Hide name fields
  }

  // Store the action in a global variable or data attribute for later use
  //document.getElementById('loginForm').dataset.action = action;
  window.selectedAction = action;
}

// Function to reset the form when modal is opened
function resetForm() {
  document.getElementById('loginForm').reset();
  document.getElementById('enrollmentIdField').classList.add('d-none'); // Hide Enrollment ID field
  
  // Reset whitelabel toggle and domain input to default state
  document.getElementById('whitelabelToggle').checked = false;
  toggleWhitelabel(); // Call this function to reset the domain field state
  
  // Clear the Console
  console.clear();
}

// Function to handle form submission
function submitForm() {
  // Call urlCreate with the selected action
  urlCreate(window.selectedAction);
}


function formatDateUTC(date) {
  // Options for month, day, and year in UTC
  const options = { month: 'short', day: 'numeric', year: 'numeric' };

  // Get the UTC formatted date part
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  // Format the time part in UTC with milliseconds
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  // Combine the date and time parts into the desired format
  return `${month} ${day}, ${year} @ ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function toggleWhitelabel() {
  const whitelabelToggle = document.getElementById('whitelabelToggle');
  const domainInput = document.getElementById('domain');
  const domainSuffix = document.getElementById('domainSuffix');

  if (whitelabelToggle.checked) {
    // Whitelabeling enabled, so allow the user to enter a full domain
    domainInput.placeholder = "learning.example.com";
    domainInput.disabled = false;  // Enable the field
    domainSuffix.style.display = "none";  // Hide the suffix
  } else {
    // Whitelabeling not enabled, show the suffix and restrict to company name
    domainInput.placeholder = "company";
    domainInput.disabled = false;  // Enable the field
    domainSuffix.style.display = "inline-block";  // Show the suffix
  }
}

function urlCreate(action) {

  const whitelabelToggle = document.getElementById('whitelabelToggle');
  let domain = document.getElementById('domain').value.trim().toLowerCase();
  const key = document.getElementById('secretKey').value.trim();
  const emailAddress = document.getElementById('email').value.toLowerCase();

  // If Enrollment ID is visible, validate it
  const enrollmentField = document.getElementById('enrollmentIdField');
  let enrollmentId = null;
  if (!enrollmentField.classList.contains('d-none')) {
    enrollmentId = document.getElementById('enrollmentId').value.trim();
    if (!enrollmentId) {
      alert("Please enter Enrollment ID.");
      return;
    }
  }

  // Check if required inputs are filled
  if (!domain || !key || !emailAddress || (action === 'Enrollment' && !enrollmentId)) {
    alert("Please fill in all fields.");
    return;
  }

  // Append ".learnupon.com" if whitelabeling is not enabled
  if (!whitelabelToggle.checked) {
      domain += ".learnupon.com";
  }

  const timestamp = Math.floor(new Date().getTime() / 1000.0);
  const message = `USER=${emailAddress}&TS=${timestamp}&KEY=${key}`;
  const token = sha256(message);


  // Build the base URL
  let url = "https://" + domain
    + "/sqsso?Email=" + encodeURIComponent(emailAddress)
    + "&TS=" + timestamp
    + "&SSOToken=" + token;

  // Conditionally append name fields and enrollment redirect URI
  if (action !== 'Enrollment') {
    const first_name = document.getElementById('firstName').value.toLowerCase().trim();
    const last_name = document.getElementById('lastName').value.toLowerCase().trim();
    url += "&first_name=" + encodeURIComponent(first_name)
        + "&last_name=" + encodeURIComponent(last_name);
    console.log('Form Submitted:', { domain, key, first_name, last_name, emailAddress, enrollmentId });
  } else {
    url += "&redirect_uri=/enrollments/" + enrollmentId;
    console.log('Form Submitted:', { domain, key, emailAddress, enrollmentId });
  }


  // Create a new date object
  const now = new Date();

  // Console Messages
  console.log("Current datetime: " + formatDateUTC(now));
  console.log("Generated URL:", url);

  // Open the URL in a new tab
  let newWindow = window.open(url, '_blank');

  // Handle pop-up blockers
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      alert('Pop-up was blocked. Please allow pop-ups for this site.');
  } else {
      // Close the modal after the URL opens successfully
      const modalElement = document.getElementById('loginModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
          modal.hide();
      }
  }
}