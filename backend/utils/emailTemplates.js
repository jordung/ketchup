const invitation = (
  invitationLink,
  inviteeEmail,
  organisationName,
  invitationCode
) => {
  return `
  <img style="width:6rem;" src="cid:unique@cid">
  <p>${inviteeEmail},</p>
  </br>
  <p>Hey! You've been invited to join ${organisationName} on Ketchup!</p>
  </br>
  <p>To get started, simply click on the invitation link below:</p>
  </br>
  <p><a href="${invitationLink}">${invitationLink}</a></p>
  </br>
  <p>Alternatively, you can head to ketchup deployed link and enter in the following invitation code after signing up!</p>
  <p><strong>${invitationCode}</strong></p>
  </br>
  </br>
  <p>By joining Ketchup, you'll be all set to create daily check ins, tickets, documents, and manage your time effectively with Ketchup.</p>
  </br>
  <p>We're confident that Ketchup will become an essential tool in your journey towards success and achievement.</p>
  </br>
  <p>If you have any questions or need assistance, feel free to reach out to our support team at ketchup.sgofficial@gmail.com. We're here to help you make the most of your Ketchup experience.</p>
  </br>
  <p>Join us now and experience the power of productivity!</p>
  </br>
  <p><strong>Best regards,</strong></p>
  <p><strong>The Ketchup Team</strong></p>
  `;
};

const verification = (user, verificationLink) => {
  return `
  <img style="width:6rem;" src="cid:unique@cid">
  <p>Dear ${user.firstName} ${user.lastName},</p>
  </br>
  <p>Welcome to Ketchup, the app that helps you stay organised and never miss a beat! We're thrilled to have you on board. Before you dive into the world of streamlined productivity, we need to verify your email address to ensure the security of your account.</p>
  </br>
  <p>To complete your registration and unlock all the amazing features of Ketchup, please follow the simple steps below to verify your email address:</p>
  </br>
  <p><strong>Click on the Verification Link:</strong> Just click on the link below, and it will take you to a page where your email address will be verified automatically.</p>
  <p><strong><a href="${verificationLink}">Verify My Email Address</a></strong></p>
  </br>
  <p><strong>If the Link Doesn't Work:</strong> If the link above doesn't work, you can copy and paste the following URL into your browser's address bar:</p>
  <p>${verificationLink}</p>
  </br>
  </br>
  <p><strong>Important Note:</strong> This verification link will expire in 24 hours for security reasons. If you miss this window, you can request a new verification email from within the Ketchup app.</p>
  </br>
  <p>Once your email address is verified, you'll be all set to create daily check ins, tickets, documents, and manage your time effectively with Ketchup.</p>
  </br>
  <p>If you have any questions or need assistance, feel free to reach out to our support team at ketchup.sgofficial@gmail.com. We're here to help you make the most of your Ketchup experience.</p>
  </br>
  <p>Thank you for choosing Ketchup to supercharge your productivity journey!</p>
  </br>
  <p><strong>Best regards,</strong></p>
  <p><strong>The Ketchup Team</strong></p>
  `;
};

module.exports = { invitation, verification };
