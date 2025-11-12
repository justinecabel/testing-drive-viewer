/**
 * doGet: returns an array of media file IDs from a Drive folder.
 *
 * Supports JSONP when the `callback` query parameter is provided.
 * - If `callback` is present, the response is JavaScript: callback(<json>) and
 *   the MIME type is set to JAVASCRIPT so a script tag can load it.
 * - Otherwise, it returns a normal JSON response.
 *
 * Deployment notes:
 * - Deploy the script as a Web App.
 * - Set "Execute as" to your account (so DriveApp has permissions).
 * - Set "Who has access" to "Anyone, even anonymous" if you want public access
 *   without requiring users to sign in (needed for purely static client JSONP).
 */
function doGet(e) {
  const FOLDER_ID = "1gspTguKzYBArU_0H9CVVVwQ8bGPafLUA";
  const callback = e && e.parameter && e.parameter.callback;

  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const mediaFileIds = [];

    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();
      if (mimeType && (mimeType.startsWith('image/') || mimeType.startsWith('video/'))) {
        mediaFileIds.push(file.getId());
      }
    }

    const payload = JSON.stringify(mediaFileIds);

    if (callback) {
      // JSONP response
      return ContentService
        .createTextOutput(callback + '(' + payload + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Regular JSON response
      return ContentService
        .createTextOutput(payload)
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    const errorPayload = JSON.stringify({ error: "Error finding folder. Check FOLDER_ID and folder permissions.", details: err && err.message });
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + errorPayload + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService
      .createTextOutput(errorPayload)
      .setMimeType(ContentService.MimeType.JSON);
  }
}