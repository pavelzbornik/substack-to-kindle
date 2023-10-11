# substack-to-kindle
A Google Apps Script project that allows you to convert Gmail messages to EPUB files.


## Features
- Gmail Integration: Connects to your Gmail account and processes specified label's unread messages.
- Image Handling: Downloads and embeds images from Gmail messages into EPUB format.
- EPUB Metadata: Includes metadata like title, author, language, and modification date in EPUB files.


## Usage
1. Configure Gmail Label:
- Create a Gmail label for the messages you want to convert (e.g., 'substack').
2. Set Up Google Apps Script:
- Open Google Apps Script.
- Paste the provided code into the script editor.
- Save your project.
3. Configure Script Properties:
- Set the Gmail label name and Google Drive folder ID in the script properties.
4. Run the Script:
- Run the `startProcessing` function to process unread messages in the specified label.

## Dependencies
Google Apps Script: This project relies on Google Apps Script for automation and Gmail integration.
