function saveEmailBodyAsHTML(body, subject, folderId) {

    var fileName = subject + ".html";

    // Get the folder where you want to save the HTML files
    var folder = DriveApp.getFolderById(folderId);

    // Save the body of the email as HTML to Drive
    var file = folder.createFile(fileName, body, MimeType.HTML);

    // Return the file object
    return file;
}

// Function to save EPUB blob to Google Drive
function saveEPUBToDrive(epubBlob, folderId, fileName) {
    var folder = DriveApp.getFolderById(folderId); // Get the folder where you want to save the EPUB file
    var file = folder.createFile(epubBlob.setName(fileName+'.epub'));
    return file;
}