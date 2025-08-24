// 数据导出服务
export function exportToCSV(data, filename = 'export.csv', columns = null) {
  if (!data || data.length === 0) {
    return { success: false, message: 'No data to export' };
  }

  try {
    let headers, fields;

    // If columns are specified, use them
    if (columns && columns.length > 0) {
      headers = columns.map(column => column.header);
      fields = columns.map(column => column.field);
    } else {
      // Otherwise, use all keys from the first data item
      headers = Object.keys(data[0]);
      fields = headers;
    }

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add rows
    data.forEach(item => {
      const row = fields.map(field => {
        const value = item[field];
        // Handle special characters
        return value !== null && value !== undefined
          ? `"${String(value).replace(/"/g, '\"')}"`
          : '""';
      });
      csvContent += row.join(',') + '\n';
    });

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, message: 'Data exported successfully' };
  } catch (error) {
    return { success: false, message: `Export failed: ${error.message}` };
  }
}