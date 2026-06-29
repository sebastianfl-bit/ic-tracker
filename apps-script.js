// ═══════════════════════════════════════════════════
// IC Tracker - Google Apps Script
// ═══════════════════════════════════════════════════
// 
// INSTRUCCIONES:
// 1. Abre https://sheets.google.com y crea una hoja nueva llamada "IC Urgencia CAS"
// 2. Copia el ID de la hoja desde la URL:
//    https://docs.google.com/spreadsheets/d/ >>> ESTE_ID <<< /edit
// 3. Pega el ID abajo en SPREADSHEET_ID
// 4. Abre Extensiones → Apps Script
// 5. Pega este código completo (reemplazando todo)
// 6. Clic en "Implementar" → "Nueva implementación"
// 7. Tipo: "Aplicación web"
// 8. Ejecutar como: "Yo" 
// 9. Acceso: "Cualquier persona"
// 10. Clic en "Implementar" → Copia la URL
// 11. Pega esa URL en la configuración de IC Tracker (⚙)
//
// ═══════════════════════════════════════════════════

const SPREADSHEET_ID = 'PEGAR_ID_DE_LA_HOJA_AQUI';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SPREADSHEET_ID && SPREADSHEET_ID !== 'PEGAR_ID_DE_LA_HOJA_AQUI'
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();
    
    const monthLabel = data.month || 'Datos';
    
    // Buscar o crear la hoja del mes
    let sheet = ss.getSheetByName(monthLabel);
    if (!sheet) {
      sheet = ss.insertSheet(monthLabel);
    } else {
      sheet.clear();
    }
    
    // Encabezados
    const headers = ['N°', 'Fecha', 'Hora', 'Nombre Paciente', 'RUT', 'Procedimiento', 'Horario'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1e293b')
      .setFontColor('#f1f5f9');
    
    // Datos
    const records = data.records || [];
    if (records.length > 0) {
      const rows = records.map((r, i) => [
        i + 1,
        r.fecha,
        r.hora,
        r.nombre,
        r.rut || '',
        r.procedimiento ? 'Sí' : 'No',
        r.inhabil ? 'Inhábil' : 'Hábil'
      ]);
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      
      // Colorear filas inhábiles
      rows.forEach((row, i) => {
        if (row[6] === 'Inhábil') {
          sheet.getRange(i + 2, 1, 1, headers.length).setBackground('#fef2f2');
        }
      });
    }
    
    // Resumen
    const startRow = records.length + 3;
    sheet.getRange(startRow, 1).setValue('RESUMEN').setFontWeight('bold');
    sheet.getRange(startRow + 1, 1).setValue('Total IC');
    sheet.getRange(startRow + 1, 2).setValue(records.length);
    sheet.getRange(startRow + 2, 1).setValue('Horario inhábil');
    sheet.getRange(startRow + 2, 2).setValue(records.filter(r => r.inhabil).length);
    sheet.getRange(startRow + 3, 1).setValue('Con procedimiento');
    sheet.getRange(startRow + 3, 2).setValue(records.filter(r => r.procedimiento).length);
    
    // Formato columnas
    sheet.setColumnWidth(1, 40);
    sheet.setColumnWidth(2, 100);
    sheet.setColumnWidth(3, 60);
    sheet.setColumnWidth(4, 250);
    sheet.setColumnWidth(5, 120);
    sheet.setColumnWidth(6, 110);
    sheet.setColumnWidth(7, 80);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `${records.length} registros sincronizados`,
      sheet: monthLabel,
      url: ss.getUrl() + '#gid=' + sheet.getSheetId()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'IC Tracker sync endpoint activo'
  })).setMimeType(ContentService.MimeType.JSON);
}
