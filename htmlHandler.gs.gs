function extractContentWithClass(htmlBody, className) {
  var $ = Cheerio.load(htmlBody);

  var header = $('head').html();
  var content = '<body>';
  
  // Loop through all elements with the specified class and extract their HTML content
  $('div.' + className).each(function(index, element) {
    var modifiedContent = replaceLinksAndImages($(element).html());
    content += modifiedContent;
  });
  
  

  content += '</body>';
  var html = '<html>' + header + content + '</html>';
  html=stripCSS(html)
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

// Function to replace links with footnotes and remove links from images
function replaceLinksAndImages(htmlContent) {
  var $ = Cheerio.load(htmlContent);
  var footnotes = '';
  var footnoteCounter = 1;

  // Find and replace all anchor tags
  $('a').each(function(idx, anchor) {
    var href = $(anchor).attr('href');
    
    // If the anchor tag contains an image, just remove the link but keep the image
    if ($(anchor).find('img').length > 0) {
      $(anchor).replaceWith($(anchor).html());
    } else {
      // Replace the anchor text with a footnote reference
      var anchorText = $(anchor).text();
      
      // Replace the anchor with plain text and a clickable footnote marker
      var footnoteRef = anchorText + ' <a href="#footnote-' + footnoteCounter + '" epub:type="noteref">[^' + footnoteCounter + ']</a>';
        
      $(anchor).replaceWith(footnoteRef);

      // Append the footnote content
      footnotes += `<p id="footnote-${footnoteCounter}">[${footnoteCounter}]: <a href="${href}">${href}</a></p>\n`;
      footnoteCounter++;
    }
  });

  // Append footnotes at the end of the content, if any exist
  if (footnotes) {
    $('body').append('<section class="footnotes">\n' + footnotes + '</section>');
  }

  return $.html();
}

// Function to strip all CSS-related elements (styles, classes, ids)
function stripCSS(htmlContent) {
  var $ = Cheerio.load(htmlContent);

  // Remove all <style> tags
  $('style').remove();

  // Select all <span> tags and replace them with their text
  $('span').each(function() {
    $(this).replaceWith($(this).text());
  });
  
  // Select all <img> tags and remove their width and height attributes
  $('img').each(function() {
    $(this).removeAttr('width');
    $(this).removeAttr('height');
  });
  // Remove inline styles
  $('[style]').removeAttr('style');

  // Remove class and id attributes
  $('[class]').removeAttr('class');
  // $('[id]').removeAttr('id');

  return $.html();
}