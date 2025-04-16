const emailInput = document.getElementById('ticket-email-input');
const firstInput = document.getElementById('ticket-first-name-input');
const lastInput = document.getElementById('ticket-last-name-input');
const messageInput = document.getElementById('ticket-message-input');
const statusMessage = document.getElementById('ticket-status');
const submitButton = document.getElementById('ticket-submit');

const EMAIL_INVALID = 'Please enter a valid email.';
const MESSAGE_EMPTY = 'Please enter a short message.';

const ERROR_COLOR = '#700000';
const SUCCESS_COLOR = '#00a527';
const DEFAULT_COLOR = '#000000';

var submitting = false;

/**
 * Check if the email format is valid
 * @param {String} email 
 * @returns true/false
 */
function emailFormatValid(email) {
    return Boolean(email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
}

/**
 * Set the status message
 * @param {String} message Message to appear on screen
 * @param {String} color The color to set the message
 */
function setStatusMessage(message, color) {
    statusMessage.innerHTML = message;
    if (color != null && color != '') {
        statusMessage.style.color = color;
    }
    updateSpacer();
}

function submissionisValid(email, message) {
    if (!emailFormatValid(email)) return [false, EMAIL_INVALID];
    if (message == null || message == '') return [false, MESSAGE_EMPTY];
    return [true, ''];
}

function submit() {
    if (submitting) return;
    submitting = true;
    try {
        setStatusMessage('Submitting...', DEFAULT_COLOR);
        const emailSubmission = emailInput.value;
        const firstNameSubmission = firstInput.value;
        const lastNameSubmission = lastInput.value;
        const messageSubmission = messageInput.value;

        const status = submissionisValid(emailSubmission, messageSubmission);
        const isValid = status[0];
        const statusMessage = status[1];
        if (isValid) {
            fetch('/api/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailSubmission,
                    first: firstNameSubmission,
                    last: lastNameSubmission,
                    message: messageSubmission
                })
            }).then(response => {
                submitting = false;
                return response.json();
            }).then(responseData => {
                const message = responseData.message;
                const status = responseData.status;
                if (!status) {
                    setStatusMessage(message, ERROR_COLOR);
                    return;
                }
                setStatusMessage('Ticket Submitted!', SUCCESS_COLOR);
            }).catch(err => {
                console.error(err);
                setStatusMessage('An error occurred.', ERROR_COLOR);
            });
        } else {
            setStatusMessage(statusMessage, ERROR_COLOR);
            submitting = false;
        }
    } catch (err) {
        console.log(err);
        submitting = false;
    }
    submitting = false;
}

submitButton.addEventListener('click', submit);