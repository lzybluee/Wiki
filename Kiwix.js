// ==UserScript==
// @name         Kiwix
// @namespace    https://github.com/lzybluee/Wiki
// @version      3.6
// @description  1. Redirect content url to viewer url. 2. Redirect 404 page to search url. 3. Press title text or 'w' key will link to online page.
// @author       Lzy
// @match        *://127.0.0.1:8080/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const url = window.location;
    let match = null;

    if (window.self === window.top && (match = url.pathname.match(/^\/content\/(.*)$/))) {
        const redirect_url = url.origin + '/viewer#' + match[1];
        console.log('Redirect to:', redirect_url);
        url.replace(redirect_url);
    } else if (window.parent === window.top && (match = url.pathname.match(/^\/content\/(.*?)\/(.*)$/)) && document.title === 'Page not found' && !document.querySelector(`link[rel='canonical']`)) {
        const search_url = url.origin + '/search?books.name=' + match[1] + "&pattern=" + match[2];
        window.top.document.title = 'Search: ' + decodeURIComponent(match[2]);
        console.log('Search url:', search_url);
        url.replace(search_url);
    } else if (window.parent === window.top && (match = url.pathname.match(/^\/content\/(.*?)\/(.*)$/))) {
        window.top.document.title = document.title + (url.hash ? (' - ' + decodeURIComponent(url.hash.slice(1)).replaceAll('_', ' ')) : '');
    } else if (window.parent === window.top && url.pathname === '/search') {
        window.top.document.title = 'Search: ' + new URL(url.href).searchParams.get('pattern');
    }

    function link2wiki() {
        window.open(document.querySelector(`link[rel='canonical']`).href);
    };

    let title_element = document.getElementById('firstHeading');

    if (!title_element) {
        for (const name of ['article-header', 'pcs-edit-section-title']) {
            const list = document.getElementsByClassName(name);
            if (list.length) {
                title_element = list[0];
                break;
            }
        }
    }

    title_element?.addEventListener('click', function(event) {
        if (window.getSelection().toString().length == 0) link2wiki();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'w' || event.key === 'W') link2wiki();
    });
})();