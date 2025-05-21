const TurndownService = require('turndown')

// Test with table rules added
console.log("=== TABLE FIX TEST ===");
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  \n'
});

// Add our existing rules
turndownService.addRule('removeAttributes', {
  filter: function(node) {
    return node.nodeName !== 'A' && 
           node.nodeName !== 'IMG' && 
           node.nodeName !== 'UL' && 
           node.nodeName !== 'OL' && 
           node.nodeName !== 'LI' && 
           node.nodeName !== 'BR' && 
           node.nodeName !== 'P';
  },
  replacement: function(content, node) {
    if (node.nodeName === 'PRE') {
      return '\n```\n' + content + '\n```\n';
    }
    return content;
  }
});

// Add the new table rules
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

// Test HTML table
const tableHtml = `
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
      <th>Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Row 1, Cell 1</td>
      <td>Row 1, Cell 2</td>
      <td>Row 1, Cell 3</td>
    </tr>
    <tr>
      <td>Row 2, Cell 1</td>
      <td>Row 2, Cell 2</td>
      <td>Row 2, Cell 3</td>
    </tr>
  </tbody>
</table>
`;

// Table without explicit thead
const simpleTableHtml = `
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>City</th>
  </tr>
  <tr>
    <td>John</td>
    <td>25</td>
    <td>New York</td>
  </tr>
  <tr>
    <td>Jane</td>
    <td>30</td>
    <td>Boston</td>
  </tr>
</table>
`;

console.log("Table HTML:", tableHtml);
console.log("Table Markdown:", turndownService.turndown(tableHtml));
console.log("\nSimple Table HTML:", simpleTableHtml);
console.log("Simple Table Markdown:", turndownService.turndown(simpleTableHtml));