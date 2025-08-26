document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements using modern querySelector where appropriate
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const previewText = document.getElementById('preview-text');
    const convertButton = document.getElementById('convert-button');
    const copyButton = document.getElementById('copy-button');
    const clearButton = document.getElementById('clear-button');
    const htmlToMarkdownOption = document.getElementById('html-to-markdown');
    const markdownToHtmlOption = document.getElementById('markdown-to-html');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');

    // Initialize TurndownService for HTML to Markdown conversion
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        bulletListMarker: '-',
        linkStyle: 'inlined',
        linkReferenceStyle: 'full',
        br: '  \n' // Two spaces followed by newline for line break
    });

    // Ignore style and script elements completely
    turndownService.addRule('ignoreStyleAndScript', {
        filter: ['style', 'script'],
        replacement: () => ''
    });

    // Remove unwanted attributes from HTML elements
    // Focus on getting clean HTML without styles, classes, etc.
    turndownService.addRule('removeAttributes', {
        filter: (node) => {
            // Define a set of node types we want to preserve
            const preserveNodes = new Set([
                'A', 'IMG', 'UL', 'OL', 'LI', 'BR', 'P',
                'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
            ]);
            
            // Only target nodes where we want to remove attributes but preserve structure
            return !preserveNodes.has(node.nodeName);
        },
        replacement: (content, node) => {
            if (node.nodeName === 'PRE') {
                return '\n```\n' + content + '\n```\n';
            }
            return content;
        }
    });
    
    // Add support for HTML tables
    turndownService.addRule('tableRule', {
        filter: ['table'],
        replacement: (content, node) => {
            // Process the table by rows
            const rows = node.querySelectorAll('tr');
            if (rows.length === 0) return content;

            const markdownTable = [];
            const headerSeparator = [];
            
            // Process each row
            [...rows].forEach((row, i) => {
                const cells = row.querySelectorAll('th, td');
                const isHeaderRow = row.parentNode.tagName === 'THEAD' || 
                                   (i === 0 && row.querySelectorAll('th').length > 0);
                
                let markdownRow = '| ';
                
                // Process each cell
                [...cells].forEach((cell, j) => {
                    const cellContent = cell.textContent.trim();
                    markdownRow += `${cellContent} | `;
                    
                    // If this is a header row, prepare the separator
                    if (isHeaderRow) {
                        // Create the header separator (using at least 3 dashes)
                        const dashes = '-'.repeat(Math.max(3, cellContent.length));
                        headerSeparator[j] = dashes;
                    }
                });
                
                // Add the row to the table
                markdownTable.push(markdownRow);
                
                // If this was the header row, add the separator
                if (isHeaderRow && headerSeparator.length > 0) {
                    markdownTable.push(`| ${headerSeparator.map(dashes => `${dashes} `).join('| ')}|`);
                }
            });
            
            // Return the markdown table with an empty line before and after
            return '\n\n' + markdownTable.join('\n') + '\n\n';
        }
    });

    // Update labels and placeholder text based on selected conversion type
    const updateLabels = () => {
        if (htmlToMarkdownOption.checked) {
            inputLabel.textContent = 'HTML Input';
            outputLabel.textContent = 'Markdown Output';
            inputText.placeholder = 'Enter your HTML text here...';
        } else {
            inputLabel.textContent = 'Markdown Input';
            outputLabel.textContent = 'HTML Output';
            inputText.placeholder = 'Enter your Markdown text here...';
        }
    };

    // Conversion function
    const convertText = () => {
        const text = inputText.value.trim();
        
        if (!text) {
            outputText.value = '';
            previewText.innerHTML = '';
            return;
        }

        try {
            if (htmlToMarkdownOption.checked) {
                // Convert HTML to Markdown
                const markdown = turndownService.turndown(text);
                console.log(markdown)
                outputText.value = markdown;
                previewText.innerHTML = text;
            } else {
                // Convert Markdown to HTML
                const html = markdown.parse(text);
                console.log(html)
                outputText.value = html;
                previewText.innerHTML = html;
            }
        } catch (error) {
            outputText.value = `Error during conversion: ${error.message}`;
        }
    };

    // Copy output to clipboard using the modern Clipboard API with fallback
    async function copyToClipboard() {
        try {
            // Use modern Clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(outputText.value);
            } else {
                // Fallback for older browsers
                outputText.select();
                document.execCommand('copy');
            }
            
            // Visual feedback
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 1500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    // Clear both input and output fields
    const clearFields = () => {
        inputText.value = '';
        outputText.value = '';
        inputText.focus();
    };

    // Event listeners
    htmlToMarkdownOption.addEventListener('change', updateLabels);
    markdownToHtmlOption.addEventListener('change', updateLabels);
    convertButton.addEventListener('click', convertText);
    copyButton.addEventListener('click', copyToClipboard);
    clearButton.addEventListener('click', clearFields);
    
    // Also convert on press of Ctrl+Enter when in the input field
    inputText.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            convertText();
        }
    });

    // Initialize labels
    updateLabels();
});

window.onload = async () =>  await markdown.ready;
