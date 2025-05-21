const TurndownService = require('turndown')

// Test with our fixed rules
function testFixedRules() {
  console.log("=== FIXED RULES ===");
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
  
  // Test line breaks
  const lineBreakHtml = '<p>Line 1<br>Line 2<br>Line 3</p>';
  console.log("Line Breaks HTML:", lineBreakHtml);
  console.log("Line Breaks Markdown:", turndownService.turndown(lineBreakHtml));
  
  // Test bullets
  const bulletHtml = '<ul><li>Bullet 1</li><li>Bullet 2</li><li>Bullet 3</li></ul>';
  console.log("Bullets HTML:", bulletHtml);
  console.log("Bullets Markdown:", turndownService.turndown(bulletHtml));
}

// Run test
testFixedRules();
