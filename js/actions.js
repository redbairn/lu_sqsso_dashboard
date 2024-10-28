// Determine whether the current page is using email or username
const currentPage = window.location.pathname;
const mode = currentPage.includes('username.html') ? 'username' : 'email';

// Update validation logic based on mode
function validateForm() {
  const domain = document.getElementById('domain').value;
  const key = document.getElementById('secretKey').value;

  let userName = ''; 
  let emailAddress = ''; 
  if (mode === 'username') {
    userName = document.getElementById('username').value.toLowerCase();
  } else {
    emailAddress = document.getElementById('email').value.toLowerCase();
  }
  const courseId = document.getElementById('courseId').value.trim();
  // Collect names before validating
  const first_name = document.getElementById('firstName').value.toLowerCase().trim();
  const last_name = document.getElementById('lastName').value.toLowerCase().trim();
  // Validate Enrollment ID if visible
  const enrollmentField = document.getElementById('enrollmentIdField');
  let enrollmentId = null;
  if (!enrollmentField.classList.contains('d-none')) {
      enrollmentId = document.getElementById('enrollmentId').value.trim();
  }
  // Validate LP Enrollment ID if visible
  const lpEnrollmentField = document.getElementById('lpEnrollmentIdField');
  let lpEnrollmentId = null;
  if (!lpEnrollmentField.classList.contains('d-none')) {
    lpEnrollmentId = document.getElementById('lpEnrollmentId').value.trim();
  }

  if (mode === 'username') {
    if (!domain || !key || !userName || 
      (window.selectedAction === ACTIONS.ENROLLMENT && !enrollmentId) || 
      (window.selectedAction === ACTIONS.LEARNING_PATH && !lpEnrollmentId) || 
      ((window.selectedAction === ACTIONS.CATALOG_COURSE || window.selectedAction === ACTIONS.STORE_COURSE)  && !courseId) || (window.selectedAction === ACTIONS.BASIC_LOGIN && !first_name) || (window.selectedAction === ACTIONS.BASIC_LOGIN && !last_name))
      {
        alert('Please fill out all the required fields.');
        return false;
    }
  } else {
    if (!domain || !key || !emailAddress || 
      (window.selectedAction === ACTIONS.ENROLLMENT && !enrollmentId) || 
      (window.selectedAction === ACTIONS.LEARNING_PATH && !lpEnrollmentId) ||  
      ((window.selectedAction === ACTIONS.CATALOG_COURSE || window.selectedAction === ACTIONS.STORE_COURSE)  && !courseId) || (window.selectedAction === ACTIONS.BASIC_LOGIN && !first_name) || (window.selectedAction === ACTIONS.BASIC_LOGIN && !last_name))
      {
      alert('Please fill out all the required fields.');
      return false;
    }
  }
  return true;
}

// Constants for actions
const ACTIONS = {
  BASIC_LOGIN: 'Basic Login',
  ENROLLMENT: 'Enrollment',
  LEARNING_PATH: 'Learning Path',
  CATALOG: 'Catalog',
  STORE: 'Store',
  CATALOG_COURSE: 'Catalog Course',
  STORE_COURSE: 'Store Course',
  RESOURCES: 'Resources',
};

// Initialize all tooltips on the page
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltipTriggerEl) => {
  new bootstrap.Tooltip(tooltipTriggerEl);
});



// Function to dynamically open modal for different actions
function openModal(action) {
  const modalTitle = document.getElementById('loginModalLabel');
  const modalActionButton = document.getElementById('modalActionButton');

  const enrollmentField = document.getElementById('enrollmentIdField');
  const enrollmentLabel = document.getElementById('enrollmentIdLabel');
  const courseField = document.getElementById('courseIdField');
  const courseLabel = document.getElementById('courseIdLabel');

  const lpEnrollmentIdField = document.getElementById('lpEnrollmentIdField');
  const lpEnrollmentIdLabel = document.getElementById('lpEnrollmentIdLabel');

  const tooltipElement = document.getElementById('tooltipEnrollmentId');
  const tooltipElement2 = document.getElementById('tooltipCourseId');
  const tooltipElement3 = document.getElementById('tooltipLPEnrollmentId');
  const nameFields = document.querySelectorAll('.name-fields');

  // Set modal title and context
  modalTitle.textContent = action;
  window.selectedAction = action;

  // Change the behavior of the submit button for individual actions
  modalActionButton.textContent = 'Submit';
  modalActionButton.onclick = submitForm;  // Bind the function for individual actions

  // Show the modal
  const modalElement = document.getElementById('loginModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show(); // To open the modal


  // Reset the form and hide additional fields
  resetForm();

  // Set the modal title and handle additional fields
  switch (action) {
      case ACTIONS.BASIC_LOGIN:
          modalTitle.textContent = ACTIONS.BASIC_LOGIN;
          enrollmentField.classList.add('d-none');
          courseField.classList.add('d-none');
          nameFields.forEach(field => field.classList.remove('d-none'));
          break;
      case ACTIONS.ENROLLMENT:
          modalTitle.textContent = action;
          enrollmentLabel.textContent = 'Enrollment ID';
          tooltipElement.setAttribute('title', 'You can find the Enrollment ID in the address bar of your web browser. You can find it in the address bar like so: /enrollments/123456789');
          enrollmentField.classList.remove('d-none');
          courseField.classList.add('d-none');
          lpEnrollmentIdField.classList.add('d-none');
          nameFields.forEach(field => field.classList.add('d-none'));
          break;
      case ACTIONS.LEARNING_PATH:
          modalTitle.textContent = action;
          lpEnrollmentIdLabel.textContent = 'Learning Path Enrollment ID';
          tooltipElement3.setAttribute('title', 'You can find the Learning Path Enrollment ID in the address bar of your web browser. You can find it in the address bar like so: /lpaths/123456789');
          enrollmentField.classList.add('d-none');
          courseField.classList.add('d-none');
          lpEnrollmentIdField.classList.remove('d-none');
          nameFields.forEach(field => field.classList.add('d-none'));
          break;
      case ACTIONS.CATALOG:
      case ACTIONS.STORE:
      case ACTIONS.RESOURCES:
          modalTitle.textContent = action;
          enrollmentField.classList.add('d-none');
          lpEnrollmentIdField.classList.add('d-none');
          courseField.classList.add('d-none');
          nameFields.forEach(field => field.classList.add('d-none'));
          break;
      case ACTIONS.CATALOG_COURSE:
      case ACTIONS.STORE_COURSE:
          modalTitle.textContent = action;
          enrollmentLabel.textContent = 'Course ID';
          tooltipElement2.setAttribute('title', 'You can find the Course ID in the address bar like so: /catalog/123456');
          enrollmentField.classList.add('d-none');
          courseField.classList.remove('d-none');
          lpEnrollmentIdField.classList.add('d-none');
          nameFields.forEach(field => field.classList.add('d-none'));
          break;
  }

  initializeTooltip(tooltipElement);
  initializeTooltip(tooltipElement2);
  initializeTooltip(tooltipElement3);

  modal.hide();
  modalElement.querySelector('form').reset();
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
}

function toggleUsernameField() {
  const usernameChoice = document.getElementById('usernameChoice').value;
  const usernameInput = document.getElementById('username');

  if (usernameChoice === 'default') {
      usernameInput.value = 'default_username'; // Set a default username if needed
      usernameInput.disabled = true; // Disable editing for default
  } else if (usernameChoice === 'custom') {
      usernameInput.disabled = false; // Allow custom input
      usernameInput.placeholder = "Enter your custom username";
  }
}

function openAllActionsModal() {
  // Open the modal (you can reuse the existing modal structure)
  const modalTitle = document.getElementById('loginModalLabel');
  const modalActionButton = document.getElementById('modalActionButton');

  const enrollmentField = document.getElementById('enrollmentIdField');
  const courseField = document.getElementById('courseIdField');
  const lpEnrollmentIdField = document.getElementById('lpEnrollmentIdField');
  const nameFields = document.querySelectorAll('.name-fields');

  modalTitle.textContent = 'Run All Actions';

  // Reset the form
  resetForm();

  // Change the behavior of the submit button for running all actions
  modalActionButton.textContent = 'Run All Actions';
  modalActionButton.onclick = submitAllActions;  // Bind the function for running all actions

  // Show modal with required fields
  const modal = new bootstrap.Modal(document.getElementById('loginModal'));
  modal.show();

  // Show the "Course ID", "Enrollment ID", "Learning Path Enrollment ID", and name fields
  enrollmentField.classList.remove('d-none');
  lpEnrollmentIdField.classList.remove('d-none');
  courseField.classList.remove('d-none');
  nameFields.forEach(field => field.classList.remove('d-none'));

  modal.hide();
}


function submitAllActions() {
  const actionsToRun = [
    ACTIONS.BASIC_LOGIN,
    ACTIONS.ENROLLMENT,
    ACTIONS.LEARNING_PATH,
    ACTIONS.CATALOG,
    ACTIONS.STORE,
    ACTIONS.CATALOG_COURSE,
    ACTIONS.STORE_COURSE,
    ACTIONS.RESOURCES,
  ];

  if (validateForm()) {
    actionsToRun.forEach(action => {
      urlCreate(action);
    });
  }
}


// Function to initialize tooltip
function initializeTooltip(tooltipElement, tooltipText = '') {
  if (tooltipText) {
      tooltipElement.setAttribute('title', tooltipText);
  }
  let tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement);
  if (tooltipInstance) {
      tooltipInstance.dispose();
  }
  new bootstrap.Tooltip(tooltipElement);
}

// Function to reset the form when modal is opened
function resetForm() {
  document.getElementById('loginForm').reset();
  document.getElementById('enrollmentIdField').classList.add('d-none');

  // Reset whitelabel toggle and domain input to default state
  document.getElementById('whitelabelToggle').checked = false;
  toggleWhitelabel(); // Call this function to reset the domain field state

  // Clear the Console
  console.clear();
}


// Function to handle form submission asynchronously
async function submitForm() {
  try {
    if (validateForm()) {
      await urlCreate(window.selectedAction);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}

function formatDateUTC(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  return `${month} ${day}, ${year} @ ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function toggleWhitelabel() {
  const whitelabelToggle = document.getElementById('whitelabelToggle');
  const domainInput = document.getElementById('domain');
  const domainSuffix = document.getElementById('domainSuffix');

  if (whitelabelToggle.checked) {
      domainInput.placeholder = "learning.example.com";
      domainInput.disabled = false;  // Enable the field
      domainSuffix.style.display = "none";  // Hide the suffix
  } else {
      domainInput.placeholder = "company";
      domainInput.disabled = false;  // Enable the field
      domainSuffix.style.display = "inline-block";  // Show the suffix
  }
}

function urlCreate(action) {
  let domain = document.getElementById('domain').value;
  const key = document.getElementById('secretKey').value;
  let userName = '';
  let emailAddress = '';
  if (mode === 'username') {
    userName = document.getElementById('username').value.toLowerCase();
    emailAddress = document.getElementById('email').value.toLowerCase(); /*Optional*/
  } else {
    emailAddress = document.getElementById('email').value.toLowerCase();
  }
  const courseId = document.getElementById('courseId').value.trim();
  const first_name = document.getElementById('firstName').value.toLowerCase().trim();
  const last_name = document.getElementById('lastName').value.toLowerCase().trim();

  const lpEnrollmentId = document.getElementById('lpEnrollmentId').value.trim();
  const enrollmentId = document.getElementById('enrollmentId').value.trim();

  const whitelabelToggle = document.getElementById('whitelabelToggle');

  // Append ".learnupon.com" if whitelabeling is not enabled
  if (!whitelabelToggle.checked) {
      domain += ".learnupon.com";
  }

  const timestamp = Math.floor(Date.now() / 1000.0);
  let message = ''; 

  if (mode === 'username') {
    // The end user should be able to provide an email address or leave the form without one
    message = `SSOUserName=${userName}&USER=${emailAddress}&TS=${timestamp}&KEY=${key}`;
    console.log("Token Parsed: " + message);
  } else {
    message = `USER=${emailAddress}&TS=${timestamp}&KEY=${key}`;
    console.log("Token Parsed: " + message);
  }

  const token = sha256(message);

  // Build the base URL
  let url = "https://" + domain + "/sqsso?";
  if (mode === 'username') {
      url += "Email=" + encodeURIComponent(emailAddress);
      url += "&SSOUserName=" + encodeURIComponent(userName);
  } else {
      url += "Email=" + encodeURIComponent(emailAddress);
  }
  url += "&TS=" + timestamp;
  url += "&SSOToken=" + token;




  // Conditionally append name fields and enrollment redirect URI
  switch (action) {
      case ACTIONS.BASIC_LOGIN:
          const first_name = document.getElementById('firstName').value.toLowerCase().trim();
          const last_name = document.getElementById('lastName').value.toLowerCase().trim();
          url += `&first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}`;
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, first_name, last_name, userName, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, first_name, last_name, emailAddress });
          }
          break;
      case ACTIONS.ENROLLMENT:
          url += `&redirect_uri=/enrollments/${enrollmentId}`;
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, userName, enrollmentId, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, emailAddress, enrollmentId });
          }
          break;
      case ACTIONS.LEARNING_PATH:
          url += `&redirect_uri=/lpaths/${lpEnrollmentId}/content`;
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, userName, lpEnrollmentId, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, emailAddress, lpEnrollmentId });
          }
          break;
      case ACTIONS.CATALOG:
          url += "&redirect_uri=/catalog";
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, userName, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, emailAddress });
          }
          break;
      case ACTIONS.STORE:
          url += "&redirect_uri=/store";
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, userName, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, emailAddress });
          }
          break;
      case ACTIONS.CATALOG_COURSE:
          url += `&redirect_uri=/catalog/${courseId}`;
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, userName, courseId, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, emailAddress, courseId });
          }
          break;
      case ACTIONS.STORE_COURSE:
          url += `&redirect_uri=/store/${courseId}`;
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, userName, courseId, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, emailAddress, courseId });
          }
          break;
       case ACTIONS.RESOURCES:
          url += "&redirect_uri=/learner_resource_list";
          console.log("Action selected: " + action);
          if (mode === 'username') {
            console.log('Form Submitted:', { domain, key, userName, emailAddress });
          } else {
            console.log('Form Submitted:', { domain, key, emailAddress });
          }
          break;
      default:
          alert("Invalid action selected.");
          return;
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
    // Optionally keep the modal open or reset the form
  } else {
      // Close the modal after the URL opens successfully
      const modalElement = document.getElementById('loginModal');
      let modal = bootstrap.Modal.getInstance(modalElement);
      if (!modal) {
          modal = new bootstrap.Modal(modalElement);
      }
      modal.hide();
  }


   


}
