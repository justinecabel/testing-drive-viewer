function doGet() {

  const FOLDER_ID = "1gspTguKzYBArU_0H9CVVVwQ8bGPafLUA";

  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const mediaItems = [];

    // Loop through all files in the folder
    while (files.hasNext()) {
      let file = files.next();
      let mimeType = file.getMimeType();

      // Check if the file's MIME type starts with 'image/' or 'video/'
      if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
        let item = {
          id: file.getId(),
          mimeType: mimeType,
          fileType: mimeType.split('/')[0] // 'image' or 'video'
        };
        mediaItems.push(item);
      }
    }

    // Return the list of items with IDs and file types as JSON data
    return ContentService
      .createTextOutput(JSON.stringify(mediaItems))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    // Return an error message if the folder ID is wrong or inaccessible
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Error finding folder. Check FOLDER_ID and folder permissions.", details: e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}