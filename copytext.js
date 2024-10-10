// copytext.js

// Define the CopyText Custom Element
class CopyText extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Create a wrapper span
        const wrapper = document.createElement('span');
        wrapper.style.cursor = 'pointer';
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.color = '#007BFF'; /* Optional: Customize text color */
        wrapper.style.userSelect = 'text'; /* Allow text selection */

        // Clone and append child nodes
        Array.from(this.childNodes).forEach(node => {
            wrapper.appendChild(node.cloneNode(true));
        });

        // Create copy icon
        const copyIcon = document.createElement('i');
        copyIcon.className = 'fa-regular fa-copy';
        copyIcon.style.marginLeft = '8px';
        copyIcon.style.color = '#007BFF'; /* Match icon color with text */
        copyIcon.style.pointerEvents = 'none'; /* Prevent icon from capturing click events */

        wrapper.appendChild(copyIcon);

        // Append to shadow DOM
        this.shadowRoot.appendChild(wrapper);

        // Event listener for copy action
        wrapper.addEventListener('click', () => {
            const textToCopy = this.textContent.trim();
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast('Copied to clipboard');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    showToast('Failed to copy');
                });
        });
    }
}

// Define the custom element
customElements.define('copy-text', CopyText);

// Toast notification function
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
    } else {
        toast.textContent = message;
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Toast styles
function addToastStyles() {
    if (!document.getElementById('copytext-toast-styles')) {
        const toastStyle = document.createElement('style');
        toastStyle.id = 'copytext-toast-styles';
        toastStyle.textContent = `
            .toast {
                visibility: hidden;
                min-width: 200px;
                margin-left: -100px;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 5px;
                padding: 10px;
                position: fixed;
                z-index: 10000;
                left: 50%;
                bottom: 30px;
                font-size: 17px;
                opacity: 0;
                transition: opacity 0.5s, visibility 0.5s;
            }

            .toast.show {
                visibility: visible;
                opacity: 1;
            }
        `;
        document.head.appendChild(toastStyle);
    }
}

// Initialize toast styles
addToastStyles();
