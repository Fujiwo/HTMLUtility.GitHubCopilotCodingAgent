document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const convertButton = document.getElementById('convert-button');
    const htmlToMarkdownOption = document.getElementById('html-to-markdown');
    const markdownToHtmlOption = document.getElementById('markdown-to-html');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');

    // Initialize TurndownService for HTML to Markdown conversion
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        emDelimiter: '*'
    });

    // Initialize marked for Markdown to HTML conversion
    // Configure marked to produce clean, minimal HTML
    marked.setOptions({
        headerIds: false,
        mangle: false,
        sanitize: false,
        smartypants: false
    });

    // Update labels based on selected conversion type
    function updateLabels() {
        if (htmlToMarkdownOption.checked) {
            inputLabel.textContent = 'HTML Input';
            outputLabel.textContent = 'Markdown Output';
        } else {
            inputLabel.textContent = 'Markdown Input';
            outputLabel.textContent = 'HTML Output';
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

    // Event listeners
    htmlToMarkdownOption.addEventListener('change', updateLabels);
    markdownToHtmlOption.addEventListener('change', updateLabels);
    convertButton.addEventListener('click', convertText);

    // Initialize labels
    updateLabels();
});