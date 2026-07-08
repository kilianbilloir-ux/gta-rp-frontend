/* ==================== UTILITY FUNCTIONS ==================== */

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('fr-FR', options);
}

/**
 * Format a date and time to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date and time
 */
function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleDateString('fr-FR', options);
}

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

/**
 * Format a large number with abbreviations (K, M, B)
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

/**
 * Calculate time difference from now
 * @param {Date|string} date - The date to compare
 * @returns {string} Time difference (e.g., "2 hours ago")
 */
function timeAgo(date) {
    const now = new Date();
    const d = new Date(date);
    const seconds = Math.floor((now - d) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [name, secondsInInterval] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInInterval);
        if (interval >= 1) {
            return interval === 1 ? `il y a 1 ${name}` : `il y a ${interval} ${name}s`;
        }
    }

    return 'à l\'instant';
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - The phone to validate
 * @returns {boolean} True if valid phone
 */
function isValidPhone(phone) {
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} Validation result with score and feedback
 */
function validatePassword(password) {
    const result = {
        score: 0,
        feedback: []
    };

    if (password.length >= 8) result.score++;
    else result.feedback.push('Au moins 8 caractères');

    if (password.length >= 12) result.score++;
    else result.feedback.push('Au moins 12 caractères');

    if (/[a-z]/.test(password)) result.score++;
    else result.feedback.push('Au moins une lettre minuscule');

    if (/[A-Z]/.test(password)) result.score++;
    else result.feedback.push('Au moins une lettre majuscule');

    if (/[0-9]/.test(password)) result.score++;
    else result.feedback.push('Au moins un chiffre');

    if (/[!@#$%^&*]/.test(password)) result.score++;
    else result.feedback.push('Au moins un caractère spécial');

    return result;
}

/**
 * Generate a random color
 * @returns {string} Random hex color
 */
function getRandomColor() {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get initials from a name
 * @param {string} name - The name to extract initials from
 * @returns {string} Initials
 */
function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
}

/**
 * Truncate text to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Capitalize first letter of a string
 * @param {string} text - The text to capitalize
 * @returns {string} Capitalized text
 */
function capitalizeFirst(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert camelCase to Title Case
 * @param {string} text - The text to convert
 * @returns {string} Title case text
 */
function camelCaseToTitleCase(text) {
    if (!text) return '';
    return text
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

/**
 * Slugify a string
 * @param {string} text - The text to slugify
 * @returns {string} Slugified text
 */
function slugify(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Debounce a function
 * @param {function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} Debounced function
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle a function
 * @param {function} func - The function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {function} Throttled function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Deep clone an object
 * @param {object} obj - The object to clone
 * @returns {object} Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Merge multiple objects
 * @param {...objects} objs - Objects to merge
 * @returns {object} Merged object
 */
function mergeObjects(...objs) {
    return Object.assign({}, ...objs);
}

/**
 * Sort array by property
 * @param {array} arr - The array to sort
 * @param {string} prop - The property to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {array} Sorted array
 */
function sortByProperty(arr, prop, order = 'asc') {
    return arr.sort((a, b) => {
        if (a[prop] < b[prop]) return order === 'asc' ? -1 : 1;
        if (a[prop] > b[prop]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Filter array by property value
 * @param {array} arr - The array to filter
 * @param {string} prop - The property to filter by
 * @param {*} value - The value to match
 * @returns {array} Filtered array
 */
function filterByProperty(arr, prop, value) {
    return arr.filter(item => item[prop] === value);
}

/**
 * Group array by property
 * @param {array} arr - The array to group
 * @param {string} prop - The property to group by
 * @returns {object} Grouped object
 */
function groupByProperty(arr, prop) {
    return arr.reduce((grouped, item) => {
        const key = item[prop];
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
        return grouped;
    }, {});
}

/**
 * Show message in DOM
 * @param {string} message - The message to show
 * @param {string} type - Type of message ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration to show in milliseconds
 */
function showMessage(message, type = 'info', duration = 3000) {
    const messageBox = document.getElementById('messageBox');
    if (!messageBox) return;

    messageBox.className = `message-box ${type}`;
    messageBox.innerHTML = `
        <span>${message}</span>
        <button class="close-message">&times;</button>
    `;
    messageBox.classList.remove('hidden');

    const closeBtn = messageBox.querySelector('.close-message');
    closeBtn.addEventListener('click', () => {
        messageBox.classList.add('hidden');
    });

    if (duration > 0) {
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, duration);
    }
}

/**
 * Get URL parameters
 * @returns {object} URL parameters
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const obj = {};
    for (const [key, value] of params) {
        obj[key] = value;
    }
    return obj;
}

/**
 * Get a specific URL parameter
 * @param {string} param - The parameter name
 * @returns {string|null} Parameter value or null
 */
function getUrlParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

/**
 * Generate query string from object
 * @param {object} params - Parameters object
 * @returns {string} Query string
 */
function generateQueryString(params) {
    return '?' + Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}

/**
 * Store data in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error storing data:', e);
    }
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {*} Stored value or null
 */
function getStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error retrieving data:', e);
        return null;
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
function removeStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Error removing data:', e);
    }
}

/**
 * Clear all localStorage
 */
function clearStorage() {
    try {
        localStorage.clear();
    } catch (e) {
        console.error('Error clearing storage:', e);
    }
}