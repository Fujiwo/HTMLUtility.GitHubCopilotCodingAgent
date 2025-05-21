const TurndownService = require('turndown')

// Test with tables that have colspan and rowspan
console.log("=== SPANNING TABLE TEST ===");
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  \n'
});

// Add existing rule
turndownService.addRule('removeAttributes', {
  filter: function(node) {
    return node.nodeName !== 'A' && 
           node.nodeName !== 'IMG' && 
           node.nodeName !== 'UL' && 
           node.nodeName !== 'OL' && 
           node.nodeName !== 'LI' && 
           node.nodeName !== 'BR' && 
           node.nodeName !== 'P' &&
           node.nodeName !== 'H1' &&
           node.nodeName !== 'H2' &&
           node.nodeName !== 'H3' &&
           node.nodeName !== 'H4' &&
           node.nodeName !== 'H5' &&
           node.nodeName !== 'H6';
  },
  replacement: function(content, node) {
    if (node.nodeName === 'PRE') {
      return '\n```\n' + content + '\n```\n';
    }
    return content;
  }
});

// Add table rule
turndownService.addRule('tableRule', {
  filter: ['table'],
  replacement: function(content, node) {
    // Process the table by rows
    const rows = node.querySelectorAll('tr');
    if (rows.length === 0) return content;

    let markdownTable = [];
    let headerSeparator = [];
    
    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.querySelectorAll('th, td');
      const isHeaderRow = row.parentNode.tagName === 'THEAD' || 
                         (i === 0 && row.querySelectorAll('th').length > 0);
      
      let markdownRow = '| ';
      
      // Process each cell
      for (let j = 0; j < cells.length; j++) {
        const cellContent = cells[j].textContent.trim();
        markdownRow += cellContent + ' | ';
        
        // If this is a header row, prepare the separator
        if (isHeaderRow) {
          // Create the header separator (using at least 3 dashes)
          const dashes = '-'.repeat(Math.max(3, cellContent.length));
          headerSeparator.push(dashes);
        }
      }
      
      // Add the row to the table
      markdownTable.push(markdownRow);
      
      // If this was the header row, add the separator
      if (isHeaderRow && headerSeparator.length > 0) {
        markdownTable.push('| ' + headerSeparator.map(dashes => dashes + ' ').join('| ') + '|');
      }
    }
    
    // Return the markdown table with an empty line before and after
    return '\n\n' + markdownTable.join('\n') + '\n\n';
  }
});

// Table with colspan
const colspanTableHtml = `
<table>
  <tr>
    <th>Name</th>
    <th colspan="2">Contact Information</th>
  </tr>
  <tr>
    <td>John Doe</td>
    <td>555-1234</td>
    <td>john@example.com</td>
  </tr>
  <tr>
    <td>Jane Smith</td>
    <td>555-5678</td>
    <td>jane@example.com</td>
  </tr>
</table>
`;

// Table with rowspan
const rowspanTableHtml = `
<table>
  <tr>
    <th>Category</th>
    <th>Product</th>
    <th>Price</th>
  </tr>
  <tr>
    <td rowspan="2">Electronics</td>
    <td>Laptop</td>
    <td>$1200</td>
  </tr>
  <tr>
    <td>Smartphone</td>
    <td>$800</td>
  </tr>
  <tr>
    <td rowspan="2">Clothing</td>
    <td>T-Shirt</td>
    <td>$25</td>
  </tr>
  <tr>
    <td>Jeans</td>
    <td>$45</td>
  </tr>
</table>
`;

console.log("Colspan Table HTML:", colspanTableHtml);
console.log("Colspan Table Markdown:", turndownService.turndown(colspanTableHtml));
console.log("\nRowspan Table HTML:", rowspanTableHtml);
console.log("Rowspan Table Markdown:", turndownService.turndown(rowspanTableHtml));