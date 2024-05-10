function extractContentWithClass(htmlBody, className) {
  var $ = Cheerio.load(htmlBody);

  var header = $('head').html();
  var content = '<body>';
  
  // Loop through all elements with the specified class and extract their HTML content
  $('div.' + className).each(function(index, element) {
    content += $(element).html();
  });
  
  content += '</body>';
  var html = '<html>' + header + content + '</html>';
  return html;
}


function checkIfPreview(htmlBody) {
  var $ = Cheerio.load(htmlBody);

  var previewDiv = $('div:contains("Preview")');
  if (previewDiv.length > 0) {
    return true;
    }
  else return false;
}