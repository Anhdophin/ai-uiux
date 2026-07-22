function doPost(e) {
  var SHEET_NAME = 'Yoga Leads';
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  var raw = e.postData && e.postData.contents ? e.postData.contents : '{}';
  var data = JSON.parse(raw);

  var headers = [
    'submitted_at',
    'submitted_from',
    'page_url',
    'full_name',
    'email',
    'phone',
    'age',
    'goal_physical',
    'goal_mental',
    'goal_therapy',
    'motivation_note',
    'yoga_experience',
    'experience_duration',
    'yoga_types',
    'activity_level',
    'health_notice',
    'health_note',
    'free_time',
    'weekly_commitment',
    'start_time_expectation',
    'barrier',
    'class_format',
    'teacher_style',
    'environment_pref',
    'final_note'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var row = headers.map(function (key) {
    return data[key] || '';
  });

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
