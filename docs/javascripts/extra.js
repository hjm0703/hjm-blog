(function () {
    const defaultTitles = {
        abstract: 'Abstract',
        bug: 'Bug',
        caution: 'Caution',
        danger: 'Danger',
        error: 'Error',
        example: 'Example',
        info: 'Info',
        note: 'Note',
        question: 'Question',
        quote: 'Quote',
        success: 'Success',
        tip: 'Tip',
        warning: 'Warning'
    };

    const formatTypeTitle = function (type) {
        if (defaultTitles[type]) {
            return defaultTitles[type];
        }
        return type
            .replace(/[-_]+/g, ' ')
            .replace(/\b([a-z])/g, function (match, c) {
                return c.toUpperCase();
            });
    };

    const cleanExplicitTitle = function (title) {
        if (title == null) {
            return null;
        }
        title = title.trim();
        const quoted = title.match(/^(['"])(.*)\1$/);
        return quoted ? quoted[2] : title;
    };

    const ELEMENT_NODE = 1;

    const processCallouts = function () {
        document.querySelectorAll('blockquote').forEach(function (blockquote) {
            const nodes = Array.from(blockquote.childNodes);
            const groups = [];
            let current = null;

            const pushCurrent = function () {
                if (current) {
                    groups.push(current);
                    current = null;
                }
            };

            nodes.forEach(function (node) {
                if (node.nodeType === ELEMENT_NODE && node.tagName.toLowerCase() === 'p') {
                    const text = node.textContent.trim();
                    const match = text.match(/^\s*\[!([A-Za-z0-9_-]+)\](\+|-)??(?:\s+(.*))?$/);
                    if (match) {
                        pushCurrent();
                        const type = match[1].toLowerCase();
                        const explicitTitle = match[3] !== undefined ? cleanExplicitTitle(match[3].trim()) : null;

                        current = {
                            type: type,
                            modifier: match[2] || null,
                            title: explicitTitle,
                            nodes: []
                        };

                        node.innerHTML = node.innerHTML.replace(/^\s*\[![A-Za-z0-9_-]+\](?:\+|-)?(?:\s+)?/, '').trim();
                        if (node.innerHTML !== '') {
                            current.nodes.push(node);
                        }
                        return;
                    }
                }

                if (current) {
                    current.nodes.push(node);
                }
            });

            pushCurrent();

            if (groups.length === 0) {
                return;
            }

            const fragment = document.createDocumentFragment();

            groups.forEach(function (group) {
                const titleText = group.title !== null ? group.title : formatTypeTitle(group.type);

                if (group.modifier) {
                    const details = document.createElement('details');
                    details.classList.add(group.type);
                    if (group.modifier === '+') {
                        details.setAttribute('open', 'open');
                    }

                    const summary = document.createElement('summary');
                    summary.textContent = titleText;
                    details.appendChild(summary);

                    group.nodes.forEach(function (node) {
                        details.appendChild(node);
                    });

                    fragment.appendChild(details);
                } else {
                    const admonition = document.createElement('div');
                    admonition.classList.add('admonition', group.type);

                    const titleNode = document.createElement('p');
                    titleNode.classList.add('admonition-title');
                    titleNode.textContent = titleText;
                    admonition.appendChild(titleNode);

                    group.nodes.forEach(function (node) {
                        admonition.appendChild(node);
                    });

                    fragment.appendChild(admonition);
                }
            });

            blockquote.replaceWith(fragment);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processCallouts);
    } else {
        processCallouts();
    }
})();
