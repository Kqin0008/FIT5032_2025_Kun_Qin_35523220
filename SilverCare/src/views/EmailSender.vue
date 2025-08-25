<template>
  <div class="email-sender">
    <h1>Send Email</h1>
    <div class="form-container">
      <!-- Toggle for bulk email mode -->
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="isBulkEmail" /> Send Bulk Email
        </label>
      </div>
      
      <div class="form-group" v-if="!isBulkEmail">
        <label for="to">To:</label>
        <InputText id="to" v-model="to" placeholder="Recipient's email address" class="w-full" aria-describedby="to-error" />
        <span v-if="errors.to" id="to-error" class="error" role="alert">{{ errors.to }}</span>
      </div>
      
      <div class="form-group" v-else>
        <label for="recipients">Recipients (comma separated):</label>
        <textarea id="recipients" v-model="recipients" placeholder="Enter email addresses separated by commas" class="w-full" rows="3" aria-describedby="recipients-error"></textarea>
        <span v-if="errors.recipients" id="recipients-error" class="error" role="alert">{{ errors.recipients }}</span>
      </div>

      <div class="form-group">
        <label for="subject">Subject:</label>
        <InputText id="subject" v-model="subject" placeholder="Email subject" class="w-full" aria-describedby="subject-error" />
        <span v-if="errors.subject" id="subject-error" class="error" role="alert">{{ errors.subject }}</span>
      </div>

      <div class="form-group">
        <label for="body">Body:</label>
        <textarea id="body" v-model="body" placeholder="Email content" class="w-full" rows="6" aria-describedby="body-error"></textarea>
        <span v-if="errors.body" id="body-error" class="error" role="alert">{{ errors.body }}</span>
      </div>

      <div class="form-group">
        <label for="attachment">Attachment:</label>
        <input type="file" id="attachment" @change="handleFileChange" />
        <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
        <button v-if="selectedFile" @click="removeAttachment" class="remove-btn">Remove</button>
      </div>

      <Button label="Send Email" @click="handleSendEmail" :loading="sending" :disabled="sending" class="send-btn" @keydown.enter="handleSendEmail" @keydown.space="handleSendEmail" />

      <div v-if="successMessage" class="success-message" role="alert">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { sendEmail, sendBulkEmail, uploadAttachment } from '../services/emailService.js';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form fields
const to = ref('');
const recipients = ref('');
const subject = ref('');
const body = ref('');
const selectedFile = ref(null);
const sending = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const errors = ref({});
const isBulkEmail = ref(false);

// Handle file selection
function handleFileChange(event) {
  if (event.target.files.length > 0) {
    selectedFile.value = event.target.files[0];
  }
}

// Remove selected file
function removeAttachment() {
  selectedFile.value = null;
  // Clear the file input
  document.getElementById('attachment').value = '';
}

// Validate form
function validateForm() {
  let isValid = true;
  errors.value = {};

  if (!isBulkEmail.value) {
    // Single email validation
    if (!to.value.trim()) {
      errors.value.to = 'Recipient email is required';
      isValid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to.value)) {
      errors.value.to = 'Please enter a valid email address';
      isValid = false;
    }
  } else {
    // Bulk email validation
    if (!recipients.value.trim()) {
      errors.value.recipients = 'At least one recipient is required';
      isValid = false;
    } else {
      // Validate each email address
      const emails = recipients.value.split(',').map(email => email.trim()).filter(email => email);
      const invalidEmails = emails.filter(email => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));
      if (invalidEmails.length > 0) {
        errors.value.recipients = `Invalid email addresses: ${invalidEmails.join(', ')}`;
        isValid = false;
      }
    }
  }

  if (!subject.value.trim()) {
    errors.value.subject = 'Subject is required';
    isValid = false;
  }

  if (!body.value.trim()) {
    errors.value.body = 'Email body is required';
    isValid = false;
  }

  return isValid;
}

// Send email handler
async function handleSendEmail() {
  // Reset messages
  successMessage.value = '';
  errorMessage.value = '';

  // Validate form
  if (!validateForm()) {
    return;
  }

  sending.value = true;

  try {
    if (!isBulkEmail.value) {
      // Send single email
      // Prepare attachments array
      let attachments = [];

      // Process attachment if selected
      if (selectedFile.value) {
        const uploadResult = await uploadAttachment(selectedFile.value);
        if (!uploadResult.success) {
          throw new Error(uploadResult.message || 'Failed to process attachment');
        }

        attachments.push({
          base64: uploadResult.base64,
          filename: uploadResult.fileName,
          type: uploadResult.fileType,
          disposition: 'attachment'
        });
        console.log('Prepared attachment:', attachments[0]);
      }

      // Send email with object parameters
      const result = await sendEmail({
        to: to.value,
        subject: subject.value,
        text: body.value,
        attachments: attachments
      });

      if (result.success) {
        successMessage.value = 'Email sent successfully!';
        // Reset form
        to.value = '';
        subject.value = '';
        body.value = '';
        removeAttachment();
      } else {
        errorMessage.value = result.message || 'Failed to send email';
      }
    } else {
      // Send bulk email
      const emails = recipients.value.split(',').map(email => email.trim()).filter(email => email);
      
      // Send bulk email with attachment
      const result = await sendBulkEmail(
        emails,
        subject.value,
        body.value,
        selectedFile.value
      );

      if (result.success) {
        successMessage.value = `Bulk email sent successfully to ${emails.length} recipients!`;
        // Reset form
        recipients.value = '';
        subject.value = '';
        body.value = '';
        removeAttachment();
      } else {
        errorMessage.value = result.message || 'Failed to send bulk email';
      }
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while sending email';
  } finally {
    sending.value = false;
  }
}
</script>

<style scoped>
.email-sender {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
}

.form-control {
  border-radius: 4px;
}

.file-name {
  display: inline-block;
  margin-left: 10px;
  color: #333;
}

.remove-btn {
  margin-left: 10px;
  color: #e74c3c;
  background: none;
  border: none;
  cursor: pointer;
}

.send-btn {
  margin-top: 20px;
}

.success-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}

error {
  color: #721c24;
  font-size: 12px;
}
</style>