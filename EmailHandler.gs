function sendEmailWithAttachment(recipientEmail, subject, body, attachments) {
    MailApp.sendEmail({
        to: recipientEmail,
        subject: subject,
        body: body,
        attachments: attachments
    });
}


