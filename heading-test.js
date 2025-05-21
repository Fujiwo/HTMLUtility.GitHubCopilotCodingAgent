const TurndownService = require('turndown')

// Test with headings
console.log("=== HEADING TEST ===");
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  \n'
});

// Add existing rule with fix for headings
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

// Test headings
const headingsHtml = `
<h1>Heading Level 1</h1>
<h2>Heading Level 2</h2>
<h3>Heading Level 3</h3>
<h4>Heading Level 4</h4>
<h5>Heading Level 5</h5>
<h6>Heading Level 6</h6>
`;

console.log("HTML Headings:");
console.log(headingsHtml);
console.log("\nConverted Markdown:");
console.log(turndownService.turndown(headingsHtml));