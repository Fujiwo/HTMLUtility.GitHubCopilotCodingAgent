const TurndownService = require('turndown')

// Test how tables are handled
console.log("=== TABLE TEST ===");
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  \n'
});

// Add the existing rule from script.js
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

console.log("Table HTML:", tableHtml);
console.log("Table Markdown:", turndownService.turndown(tableHtml));