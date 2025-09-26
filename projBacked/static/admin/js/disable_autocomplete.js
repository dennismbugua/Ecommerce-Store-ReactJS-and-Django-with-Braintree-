// Disable autocomplete for Django Admin forms

(function() {
    'use strict';

    // Function to disable autocomplete on an element
    function disableAutocomplete(element) {
        element.setAttribute('autocomplete', 'off');
        element.setAttribute('autocapitalize', 'off');
        element.setAttribute('autocorrect', 'off');
        element.setAttribute('spellcheck', 'false');
        
        // Additional attributes for different browsers
        element.setAttribute('autoComplete', 'off'); // React/JSX style
        element.setAttribute('data-lpignore', 'true'); // LastPass
        element.setAttribute('data-form-type', 'other'); // Browser form detection
    }

    // Function to apply autocomplete disable to all relevant inputs
    function applyAutocompleteDisable() {
        // Target all text inputs, email inputs, textareas, and password fields
        const selectors = [
            'input[type="text"]',
            'input[type="email"]',
            'input[type="password"]',
            'input[type="search"]',
            'textarea'
        ];
        
        selectors.forEach(function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(disableAutocomplete);
        });

        // Also target specific Django admin fields
        const adminSelectors = [
            '.field-name input',
            '.field-description textarea',
            '.field-email input',
            '.field-first_name input',
            '.field-last_name input',
            '.field-phone input',
            '.field-gender input',
            '.field-price input',
            '.field-transaction_id input',
            '.field-payment_method input',
            '.field-products textarea'
        ];

        adminSelectors.forEach(function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(disableAutocomplete);
        });
    }

    // Apply on page load
    function init() {
        applyAutocompleteDisable();

        // Also apply to dynamically added elements (for inline forms, etc.)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if the added node is an input/textarea or contains them
                            const inputs = node.querySelectorAll ? 
                                node.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea') : 
                                [];
                            inputs.forEach(disableAutocomplete);
                            
                            // Also check if the node itself is an input/textarea
                            if (node.matches && node.matches('input[type="text"], input[type="email"], input[type="password"], textarea')) {
                                disableAutocomplete(node);
                            }
                        }
                    });
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also initialize when the page is fully loaded (for dynamic content)
    window.addEventListener('load', applyAutocompleteDisable);

})();