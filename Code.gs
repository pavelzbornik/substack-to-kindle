function processUnreadMessages(labelName, recipientEmail) {
    var folderId = PropertiesService.getScriptProperties().getProperty('FOLDER_ID')
    var threads = GmailApp.search('label:' + labelName + ' is:unread');
    for (var i = 0; i < threads.length; i++) {
        var thread = threads[i];
        var messages = thread.getMessages();
        for (var j = 0; j < messages.length; j++) {
            var message = messages[j];
            var messageId = message.getId();

            // Handle the message using messageHandler functions
            var currentMessage = getMessageById(messageId);
            if (currentMessage) {
              // Perform operations on the message
              
              var subject = message.getSubject()
              var body = message.getBody(); // Get the body of the email as HTML
              var author = message.getFrom().substring(0,message.getFrom().lastIndexOf('<') - 1)

              // check if message not Preview

              var isPreview = checkIfPreview(body);
              
              if (!isPreview){

                // var subjectClean = subject.replace(/[^\w\s]/gi, '').replace(/ /g, '_');
                var subjectClean = Utilities.newBlob(subject).getDataAsString();

                // saveEmailBodyAsHTML(body, subjectClean, folderId);
                
                var imageUrls = extractImagesFromMessageBody(body);
                var imageBlobs = downloadImages(imageUrls);

                imageProcessResult=processImageUrls(body, imageUrls)
                body=imageProcessResult.body
                var contentImages = imageProcessResult.contentImages
                epub = createEPUB(messageId,author,subject,subjectClean,body,contentImages,imageBlobs)

                saveEPUBToDrive(epub, folderId, subjectClean)

                var subjectWithEmail = 'EPUB file: ' + subjectClean;
                var bodyWithEmail = 'Please find the EPUB file attached.';
                sendEmailWithAttachment(recipientEmail, subjectWithEmail, bodyWithEmail, [epub])

                
              }
            markMessageAsRead(currentMessage);
            }

        }
    }
}


// Trigger the main processing function.
function startProcessing() {
    var labelName = PropertiesService.getScriptProperties().getProperty('GMAIL_LABEL');
    var recipientEmail = PropertiesService.getScriptProperties().getProperty('RECIPIENT_EMAIL');
    processUnreadMessages(labelName, recipientEmail);
}






