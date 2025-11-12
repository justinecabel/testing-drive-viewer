function doGet() {

  const FOLDER_ID = "1gspTguKzYBArU_0H9CVVVwQ8bGPafLUA";

  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const mediaFileIds = [];

    // Loop through all files in the folder
    while (files.hasNext()) {
      let file = files.next();
      let mimeType = file.getMimeType();

      // Check if the file's MIME type starts with 'image/' or 'video/'
      if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
        mediaFileIds.push(file.getId());
      }
    }

    // Return the list of IDs as JSON data
    return ContentService
      .createTextOutput(JSON.stringify(mediaFileIds))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    // Return an error message if the folder ID is wrong or inaccessible
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Error finding folder. Check FOLDER_ID and folder permissions.", details: e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}