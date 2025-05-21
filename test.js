const TurndownService = require('turndown')

// Test with default configuration
function testDefault() {
  console.log("=== DEFAULT CONFIGURATION ===");
  const turndownService = new TurndownService();
  
  // Test line breaks
  const lineBreakHtml = '<p>Line 1<br>Line 2<br>Line 3</p>';
  console.log("Line Breaks HTML:", lineBreakHtml);
  console.log("Line Breaks Markdown:", turndownService.turndown(lineBreakHtml));
  
  // Test bullets
  const bulletHtml = '<ul><li>Bullet 1</li><li>Bullet 2</li><li>Bullet 3</li></ul>';
  console.log("Bullets HTML:", bulletHtml);
  console.log("Bullets Markdown:", turndownService.turndown(bulletHtml));

  console.log("\n");
}

// Test with custom configuration
function testCustom() {
  console.log("=== CUSTOM CONFIGURATION ===");
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full',
    br: '  \n'
  });
  
  // Test line breaks
  const lineBreakHtml = '<p>Line 1<br>Line 2<br>Line 3</p>';
  console.log("Line Breaks HTML:", lineBreakHtml);
  console.log("Line Breaks Markdown:", turndownService.turndown(lineBreakHtml));
  
  // Test bullets
  const bulletHtml = '<ul><li>Bullet 1</li><li>Bullet 2</li><li>Bullet 3</li></ul>';
  console.log("Bullets HTML:", bulletHtml);
  console.log("Bullets Markdown:", turndownService.turndown(bulletHtml));

  console.log("\n");
}

// Test with custom rules
function testCustomRules() {
  console.log("=== CUSTOM RULES ===");
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full',
    br: '  \n'
  });
  
  // Add a rule similar to the one in script.js
  turndownService.addRule('removeAttributes', {
    filter: function(node) {
      return node.nodeName !== 'A' && node.nodeName !== 'IMG';
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

// Run tests
testDefault();
testCustom();
testCustomRules();
