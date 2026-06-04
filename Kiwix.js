// ==UserScript==
// @name         Kiwix
// @namespace    https://github.com/lzybluee/Wiki
// @version      6.6
// @description  1. Redirect content url to viewer url. 2. Redirect 404 page to search url. 3. Add source page button.
// @author       Lzy
// @match        *://127.0.0.1:8080/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const top_window = window.top;
    const url = window.location;
    let source_ele = null;
    let match = null;

    if (window.self !== top_window && window.parent === top_window) {
        source_ele = top_window.document.getElementById('source_page_button');
        const random_ele = top_window.document.getElementById('kiwix_serve_taskbar_random_button');
        if (!source_ele && random_ele) {
            source_ele = top_window.document.createElement('a');
            source_ele.id = 'source_page_button';
            source_ele.title = 'Go to source page';
            source_ele.target = '_blank';
            const source_btn = top_window.document.createElement('button');
            source_btn.textContent = '🌐';
            source_ele.appendChild(source_btn);
            random_ele.after(source_ele);
        }
    }

    if (window.self === top_window && (match = url.pathname.match(/^\/content\/(.*)$/))) {
        const redirect_url = url.origin + '/viewer#' + match[1];
        console.log('Redirect to:', redirect_url);
        url.replace(redirect_url);
    } else if (window.parent === top_window && (match = url.pathname.match(/^\/content\/(.*?)\/(.*)$/)) && document.title === 'Page not found' && !document.querySelector(`link[rel='canonical']`)) {
        const search_url = url.origin + '/search?books.name=' + match[1] + "&pattern=" + match[2];
        top_window.document.title = 'Search: ' + decodeURIComponent(match[2]);
        source_ele.style.display = 'none';
        console.log('Search url:', search_url);
        url.replace(search_url);
    } else if (window.parent === top_window && (match = url.pathname.match(/^\/content\/(.*?)\/(.*)$/))) {
        top_window.document.title = document.title + (url.hash ? (' - ' + decodeURIComponent(url.hash.slice(1)).replaceAll('_', ' ')) : '');

        const source_url = document.querySelector(`link[rel='canonical']`)?.href;
        if (source_url) {
            source_ele.style.display = '';
            source_ele.href = source_url + url.hash;
        } else {
            source_ele.style.display = 'none';
        }
    } else if (window.parent === top_window && url.pathname === '/search') {
        top_window.document.title = 'Search: ' + new URL(url.href).searchParams.get('pattern');
        source_ele.style.display = 'none';
    }
})();