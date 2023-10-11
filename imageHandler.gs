function downloadImages(imageUrls) {
  var imageBlobs = []; // List to store image blobs

  // Download filtered images and store blobs in the list
  imageUrls.forEach(function(url) {
    var response = UrlFetchApp.fetch(url);
    var imageBlob = response.getBlob();
    imageBlobs.push(imageBlob);
  });

  // Now imageBlobs contains all downloaded image blobs
  return imageBlobs;
}


function extractImagesFromMessageBody(body) {
  
  // Use a regular expression to find all image URLs in the HTML body
  var imageUrls = body.match(/<img[^>]*src="([^"]*)"/g);
  
  if (imageUrls) {
    imageUrls = imageUrls.map(function (imgTag) {
      var srcMatch = imgTag.match(/src="([^"]*)"/);
      if (srcMatch && srcMatch[1]) {
        
        var imageUrl = srcMatch[1];
        var imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1); // Extract image name from URL
        body = body.replace(imageUrl, imageName); // Replace URL with image name in the HTML body
        return imageUrl;
      }
      return null;
    }).filter(function (url) {
      // Filter only .jpg and .jpeg URLs
      return url !== null && (url.toLowerCase().endsWith('.jpg')|| url.toLowerCase().endsWith('.jpeg'));
    });
  } else {
    imageUrls = [];
  }


  
  return imageUrls;
}

function formatImageName(imageUrl, index) {
    var imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    var imageExtension = imageName.substring(imageName.lastIndexOf('.') + 1);
    return index + '.' + imageExtension;
}


function processImageUrls(body, imageUrls, imageBlobs, contentImages) {
    imageUrls.forEach(function (url, index) {
        var imageName = formatImageName(url, index);
        var formattedUrl = 'images/' + imageName;
        
        // Replace URL with image name in the HTML body
        body = body.replace(url, formattedUrl);
        
        // Download image and store it as a blob
        // var imageBlob = downloadImageBlob(url, imageName);
        
        // Create image text for EPUB content
        var imageText = '<item href="' + formattedUrl + '" id="' + imageName + '" media-type="image/' + imageName.split('.').pop() + '"/>';
        
        // Add the image blob and image text to respective lists
        // imageBlobs.push(imageBlob);
        contentImages.push(imageText);
    });

    return body; // Return the updated HTML body
}