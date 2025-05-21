const TurndownService = require('turndown')

// Test with more complex tables
console.log("=== COMPLEX TABLE TEST ===");
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  \n'
});

// Add the existing removeAttributes rule
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

// Add our table rule
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

// Test a table with formatting in cells
const formattedTableHtml = `
<table>
  <tr>
    <th>Formatting</th>
    <th>Example</th>
  </tr>
  <tr>
    <td>Bold text</td>
    <td><strong>This text is bold</strong></td>
  </tr>
  <tr>
    <td>Italic text</td>
    <td><em>This text is italic</em></td>
  </tr>
  <tr>
    <td>Links</td>
    <td><a href="https://example.com">Example link</a></td>
  </tr>
</table>
`;

// Test a table with nested content
const nestedTableHtml = `
<table>
  <tr>
    <th>Category</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Lists</td>
    <td>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>Paragraphs</td>
    <td>
      <p>First paragraph</p>
      <p>Second paragraph</p>
    </td>
  </tr>
</table>
`;

console.log("Formatted Table HTML:", formattedTableHtml);
console.log("Formatted Table Markdown:", turndownService.turndown(formattedTableHtml));
console.log("\nNested Table HTML:", nestedTableHtml);
console.log("Nested Table Markdown:", turndownService.turndown(nestedTableHtml));