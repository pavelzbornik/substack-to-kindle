function createEPUB(messageId,author,subject,subjectClean,body,contentImages,imageBlobs) {
  
  // Get the current date and time in UTC format
  var currentDate = new Date().toISOString();

  // Format the current date to match the required format '2000-03-24T00:00:00Z'
  var formattedDate = currentDate.split('T')[0] + 'T' + currentDate.split('T')[1].split('.')[0] + 'Z';
  var imageHTML=contentImages.join(' ')

  var container = '<?xml version="1.0"?>' +
      '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">' +
      '  <rootfiles>' + 
      '    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />' + 
      '  </rootfiles>' + 
      '</container>';
  var containerBlob = Utilities.newBlob(container,'application/xhtml+xml','META-INF/container.xml');      
  
  var metadata = '<?xml version="1.0"?>' +
      '<package version="3.0" xml:lang="en" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id">' + 
      '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">' +
      '    <dc:identifier id="book-id">urn:uuid:'+messageId+'</dc:identifier>' + 
      '    <meta refines="#book-id" property="identifier-type" scheme="xsd:string">uuid</meta>' + 
      '    <meta property="dcterms:modified">'+formattedDate+'</meta>' + 
      '    <dc:language>en</dc:language>' +
      '    <dc:title>'+subject+'</dc:title>' +
      '    <dc:creator>'+author+'</dc:creator>' +
      '    <meta name="cover" content="images/0.jpeg"/>'+
      '  </metadata>' +
      '  <manifest>' +
      '    <item id="toc" href="toc.ncx" media-type="application/x-dtbncx+xml"/>' +
      '    <item id="text" href="text.xhtml" media-type="application/xhtml+xml"/>' +
      +imageHTML+
      '  </manifest>' +
      '  <spine toc="toc">' +
      '    <itemref idref="toc"/>' +
      '    <itemref idref="text"/>' +
      '  </spine>' +
      '</package>';
  var metadataBlob = Utilities.newBlob(metadata,'application/xhtml+xml','OEBPS/content.opf');      

  // Set the table of contents for the book
  var toc = '<?xml version="1.0"?>' +
      '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">' +
      '  <head>' +
      '    <meta name="dtb:uid" content="urn:uuid:'+messageId+'"/>' +
      '    <meta name="dtb:depth" content="1"/>' +
      '    <meta name="dtb:totalPageCount" content="0"/>' +
      '    <meta name="dtb:maxPageNumber" content="0"/>' +
      '  </head>' +
      '  <docTitle>' +
      '    <text>'+subject+'</text>' +
      '  </docTitle>' +
      '  <navMap>' +
      '    <navPoint id="navpoint-1" playOrder="1">' +
      '      <navLabel>' +
      '        <text>'+subject+'</text>' +
      '      </navLabel>' +
      '      <content src="text.xhtml"/>' +
      '    </navPoint>' +
      '  </navMap>' +
      '</ncx>';
  var tocBlob = Utilities.newBlob(toc,'application/xhtml+xml','OEBPS/toc.ncx');  


  var bodyExtract = extractContentWithClass(body, 'body')

  // Add the text of the book to the ZIP file
  var text = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' + bodyExtract;
  var textBlob = Utilities.newBlob(text,'application/xhtml+xml','OEBPS/text.xhtml');  
  
  // Create Zip file
  var zip = Utilities.zip([containerBlob,metadataBlob,tocBlob,textBlob].concat(imageBlobs),subjectClean+'.epub')


  return zip
}


// function extractContentWithClass(htmlBody, className) {
//   var $ = Cheerio.load(htmlBody);

//   var header = $('head').html();
//   // Extract content of div with the specified class
//   var content = '<body>'+$('div.' + className).html()+'</body>';
//   var html = '<html>' + header + content + '</html>'
//   return html;
// }


