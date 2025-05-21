const TurndownService = require('turndown')

// Test with our fixed implementation
console.log("=== FINAL TEST ===");
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  \n'
});

// Add our fixed rule
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

// Complex example with both line breaks and bullet points
const complexHtml = `
<div>
  <h2>Test Document</h2>
  <p>This is a paragraph with <br>multiple line<br>breaks.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2 with <strong>bold</strong> text</li>
    <li>Item 3 with <br>a line break</li>
  </ul>
  <p>Another paragraph.</p>
  <pre>
    Some pre-formatted code
    with multiple lines
  </pre>
  <h3>A Subsection</h3>
  <p>Some additional text in the subsection.</p>
</div>
`;

console.log("Original HTML:");
console.log(complexHtml);
console.log("\nConverted Markdown:");
console.log(turndownService.turndown(complexHtml));
