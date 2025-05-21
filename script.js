document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
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

    // Remove unwanted attributes from HTML elements
    // Focus on getting clean HTML without styles, classes, etc.
    turndownService.addRule('removeAttributes', {
        filter: function(node) {
            // Only target nodes where we want to remove attributes but preserve structure
            // Exclude nodes that have special handling or are structural elements
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

    // Initialize marked for Markdown to HTML conversion
    // Configure marked to produce clean, minimal HTML
    marked.setOptions({
        headerIds: false,
        mangle: false,
        sanitize: false,
        smartypants: false,
        xhtml: true
    });

    // Update labels and placeholder text based on selected conversion type
    function updateLabels() {
        if (htmlToMarkdownOption.checked) {
            inputLabel.textContent = 'HTML Input';
            outputLabel.textContent = 'Markdown Output';
            inputText.placeholder = 'Enter your HTML text here...';
        } else {
            inputLabel.textContent = 'Markdown Input';
            outputLabel.textContent = 'HTML Output';
            inputText.placeholder = 'Enter your Markdown text here...';
        }
    }

    // Conversion function
    function convertText() {
        const text = inputText.value.trim();
        
        if (!text) {
            outputText.value = '';
            return;
        }

        try {
            if (htmlToMarkdownOption.checked) {
                // Convert HTML to Markdown
                const markdown = turndownService.turndown(text);
                outputText.value = markdown;
            } else {
                // Convert Markdown to HTML
                const html = marked.parse(text);
                outputText.value = html;
            }
        } catch (error) {
            outputText.value = `Error during conversion: ${error.message}`;
        }
    }

    // Copy output to clipboard
    function copyToClipboard() {
        outputText.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 1500);
    }

    // Clear both input and output fields
    function clearFields() {
        inputText.value = '';
        outputText.value = '';
        inputText.focus();
    }

    // Event listeners
    htmlToMarkdownOption.addEventListener('change', updateLabels);
    markdownToHtmlOption.addEventListener('change', updateLabels);
    convertButton.addEventListener('click', convertText);
    copyButton.addEventListener('click', copyToClipboard);
    clearButton.addEventListener('click', clearFields);
    
    // Also convert on press of Enter when in the input field
    inputText.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            convertText();
        }
    });

    // Initialize labels
    updateLabels();
});