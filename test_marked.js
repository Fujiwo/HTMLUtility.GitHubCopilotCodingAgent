#!/usr/bin/env node

// Test script to verify marked library functionality
console.log('Testing marked library...');

// Simulate the browser environment
global.window = {};

// Import marked
const marked = require('marked');

// Test basic functionality
const testMarkdown = `# Test Header

This is a **bold** and *italic* text with \`inline code\`.

## Lists
- Item 1
- Item 2

## Code block
\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

## Mermaid block (special processing)
\`\`\`mermaid
graph TD
A --> B
\`\`\`

## Math block (special processing)
\`\`\`math
x = y + z
\`\`\`
`;

// Test marked parsing
console.log('Original markdown:');
console.log(testMarkdown);
console.log('\n=== Converted HTML ===');
console.log(marked.parse(testMarkdown));

// Test special block processing (simulating our app's logic)
const processSpecialBlocks = (markdownText) => {
    // Rule 1: Convert ```mermaid\n(content)\n``` to <pre class="mermaid">(content)</pre>
    markdownText = markdownText.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, content) => {
        console.log('Processing mermaid block');
        return `<pre class="mermaid">${content}</pre>`;
    });
    
    // Rule 2: Convert ```math\n(content)\n``` to <math>(content)</math>
    markdownText = markdownText.replace(/```math\n([\s\S]*?)\n```/g, (match, content) => {
        console.log('Processing math block');
        return `<math>${content}</math>`;
    });
    
    return markdownText;
};

console.log('\n=== With special block processing ===');
const processedMarkdown = processSpecialBlocks(testMarkdown);
console.log(marked.parse(processedMarkdown));