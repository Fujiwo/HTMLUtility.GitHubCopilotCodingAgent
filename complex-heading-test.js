const TurndownService = require('turndown')

// Test with complex HTML containing headings and other elements
console.log("=== COMPLEX HEADING TEST ===");
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  \n'
});

// Add rule with fix for headings
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

// Test complex HTML with headings mixed with other elements
const complexHtml = `
<div>
  <h1>Main Document Title</h1>
  <p>This is an introduction paragraph.</p>
  
  <h2>Section 1</h2>
  <p>This is the first section with a <a href="https://example.com">link</a>.</p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
  
  <h3>Subsection 1.1</h3>
  <p>This is a subsection with some <strong>bold</strong> and <em>italic</em> text.</p>
  <pre>
    function example() {
      return "This is a code block";
    }
  </pre>
  
  <h2>Section 2</h2>
  <p>This is the second section.</p>
  <table>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
    <tr>
      <td>Row 1, Cell 1</td>
      <td>Row 1, Cell 2</td>
    </tr>
    <tr>
      <td>Row 2, Cell 1</td>
      <td>Row 2, Cell 2</td>
    </tr>
  </table>
</div>
`;

console.log("Complex HTML with Headings:");
console.log(complexHtml);
console.log("\nConverted Markdown:");
console.log(turndownService.turndown(complexHtml));