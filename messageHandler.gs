function getMessageById(messageId) {
  try {
    return GmailApp.getMessageById(messageId);
  } catch (error) {
    console.error('Error getting message by ID:', error);
    return null;
  }
}

function markMessageAsRead(message) {
  try {
    message.markRead();
    console.log('Message marked as read:', message.getSubject());
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}
