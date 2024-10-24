function downloadImages(imageUrls) {
  var imageBlobs = []; // List to store image blobs
  var failedUrls = []; // List to store failed URLs

  // Download filtered images and store blobs in the list
  for (var i = 0; i < imageUrls.length; i++) {
    url=imageUrls[i]
    var response = UrlFetchApp.fetch(url);
    var imageName = formatImageName(url, i);
    
    if (url.toLowerCase().endsWith('.png')){
      var imageBlob = convertPNGtoJPEGAndExport(response.getBlob());
      
    }
    else {
      var imageBlob = response.getBlob();
    }  
    
    // imageBlob=Utilities.newBlob(imageBlob.getBytes(), imageBlob.getContentType(), 'OEBPS/images/'+imageName);
    // imageBlobs.push(imageBlob);

    // Check if imageBlob is null
    if (imageBlob !== null) {
      imageBlob = Utilities.newBlob(imageBlob.getBytes(), imageBlob.getContentType(), 'OEBPS/images/' + imageName);
      imageBlobs.push(imageBlob);
    } else {
      console.error("Image conversion failed for URL:", url);
      // Handle the failure here, like skipping the image or logging the error
      failedUrls.push(url); // Add failed URL to the list
    }
  };

  // Now imageBlobs contains all downloaded image blobs
  return { imageBlobs: imageBlobs, failedUrls: failedUrls };
}


function extractImagesFromMessageBody(body) {
  
  // Use a regular expression to find all image URLs in the HTML body
  var imageUrls = body.match(/<img[^>]*src="([^"]*)"/g);
  
  if (imageUrls) {
    imageUrls = imageUrls.map(function (imgTag) {
      var srcMatch = imgTag.match(/src="([^"]*)"/);
      if (srcMatch && srcMatch[1]) {
        
        var imageUrl = srcMatch[1];
        return imageUrl;
      }
      return null;
    }).filter(function (url) {
      // Filter only .jpg and .jpeg URLs
      return url !== null && (url.toLowerCase().endsWith('.jpg')|| url.toLowerCase().endsWith('.jpeg')|| url.toLowerCase().endsWith('.png'));
    });
  } else {
    imageUrls = [];
  }


  
  return imageUrls;
}

function formatImageName(imageUrl, index) {
    var imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    var imageExtension = imageName.substring(imageName.lastIndexOf('.') + 1).replace('png','jpeg');
    return index + '.' + imageExtension;
}

function renameBlob(blob,newFileName) {
  return Utilities.newBlob(blob.getBytes(), blob.getContentType(), newFileName);

}


function processImageUrls(body, imageUrls,allFailedUrls) {
    var contentImages = [];

    imageUrls.forEach(function (url, index) {
        var imageName = formatImageName(url, index);
        var formattedUrl = '../OEBPS/images/' + imageName;

        // Try to replace the image URL
        if (allFailedUrls.includes(url)) {
            // If conversion fails, remove the image tag from the HTML body
            var imgTagRegex = new RegExp('<img[^>]*src=["\']' + url + '["\'][^>]*>', 'g');
            body = body.replace(imgTagRegex, ''); // Remove the entire <img> tag
            console.error("Image conversion failed for URL:", url);
        } else {
                      // Replace URL with image name in the HTML body
            body = body.replace(url, formattedUrl);
            
            // Create image text for EPUB content
            var imageText = '<item href="' + formattedUrl + '" id="' + imageName + '" media-type="image/' + imageName.split('.').pop() + '"/>';
            contentImages.push(imageText);

        }
    });

    return { body: body, contentImages: contentImages };
}


// function convertPNGtoJPEGAndExport(pngBlob) {
//   // Create a new presentation
//   var presentation = SlidesApp.create('Temporary Presentation');

//   // Get the first slide in the presentation
//   var slide = presentation.getSlides()[0];

//   // Add the PNG image blob to the slide
//   var image = slide.insertImage(pngBlob);

//   // Get the image blob from the slide
//   var imageBlob = image.getBlob();

//   // Convert the image to JPEG within the slide
//   image.replace(imageBlob.getAs(MimeType.JPEG));

//   // // Export the slide as a JPEG image blob
//   // var exportOptions = SlidesApp.SaveImageOptions.jpeg();
//   // var exportedBlob = slide.getBlob(exportOptions);

//   // Delete the temporary presentation
//   DriveApp.getFileById(presentation.getId()).setTrashed(true);

//   // Return the exported JPEG image blob
//   return image.getBlob();
// }
function convertPNGtoJPEGAndExport(pngBlob) {
  try {
    // Create a new presentation
    var presentation = SlidesApp.create('Temporary Presentation');

    // Get the first slide in the presentation
    var slide = presentation.getSlides()[0];

    // Add the PNG image blob to the slide
    var image = slide.insertImage(pngBlob);

    // Get the image blob from the slide
    var imageBlob = image.getBlob();

    // Convert the image to JPEG within the slide
    image.replace(imageBlob.getAs(MimeType.JPEG));

    // Export the slide as a JPEG image blob
    // var exportOptions = SlidesApp.SaveImageOptions.jpeg();
    // var exportedBlob = slide.getBlob(exportOptions);

    // Delete the temporary presentation
    DriveApp.getFileById(presentation.getId()).setTrashed(true);

    // Return the exported JPEG image blob
    return image.getBlob();
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("An error occurred:", error);
    return null; // Or you can throw the error again if needed
  }
}

