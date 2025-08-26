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

    // Initialize Mermaid
    let mermaidInitialized = false;
    const initializeMermaid = () => {
        if (typeof mermaid !== 'undefined' && !mermaidInitialized) {
            mermaid.initialize({ 
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose'
            });
            mermaidInitialized = true;
        }
    };

    // Process math blocks - convert ```math to MathJax format
    const processMathBlocks = (html) => {
        // Convert ```math blocks to MathJax display math
        return html.replace(/```math\s*([\s\S]*?)\s*```/g, (match, mathContent) => {
            return `<div class="math-block">$$${mathContent.trim()}$$</div>`;
        });
    };

    // Render mermaid diagrams
    const renderMermaidDiagrams = async (element) => {
        const mermaidElements = element.querySelectorAll('pre code.language-mermaid, .language-mermaid');
        
        for (let i = 0; i < mermaidElements.length; i++) {
            const mermaidElement = mermaidElements[i];
            const mermaidCode = mermaidElement.textContent;
            
            try {
                const graphDefinition = mermaidCode.trim();
                const { svg } = await mermaid.render(`mermaid-${Date.now()}-${i}`, graphDefinition);
                
                // Replace the code block with the SVG
                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid';
                wrapper.innerHTML = svg;
                
                if (mermaidElement.parentNode.tagName === 'PRE') {
                    mermaidElement.parentNode.parentNode.replaceChild(wrapper, mermaidElement.parentNode);
                } else {
                    mermaidElement.parentNode.replaceChild(wrapper, mermaidElement);
                }
            } catch (error) {
                console.error('Mermaid rendering error:', error);
                // Keep the original code block if rendering fails
            }
        }
    };

    // Update preview content
    const updatePreview = async (htmlContent) => {
        if (!htmlContent || htmlToMarkdownOption.checked) {
            previewText.innerHTML = '';
            return;
        }

        // Process math blocks first
        const processedHtml = processMathBlocks(htmlContent);
        previewText.innerHTML = processedHtml;

        // Initialize Mermaid if needed
        initializeMermaid();

        // Render Mermaid diagrams
        if (typeof mermaid !== 'undefined') {
            await renderMermaidDiagrams(previewText);
        }

        // Apply Prism syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(previewText);
        }

        // Re-render MathJax
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([previewText]).catch((err) => {
                console.error('MathJax rendering error:', err);
            });
        }
    };

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
    const convertText = async () => {
        const text = inputText.value.trim();
        
        if (!text) {
            outputText.value = '';
            await updatePreview('');
            return;
        }

        try {
            if (htmlToMarkdownOption.checked) {
                // Convert HTML to Markdown
                const markdownResult = turndownService.turndown(text);
                outputText.value = markdownResult;
                await updatePreview('');
            } else {
                // Convert Markdown to HTML
                const htmlResult = markdown.parse(text);
                outputText.value = htmlResult;
                await updatePreview(htmlResult);
            }
        } catch (error) {
            outputText.value = `Error during conversion: ${error.message}`;
            await updatePreview('');
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
        previewText.innerHTML = '';
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
