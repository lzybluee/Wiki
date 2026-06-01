// ==UserScript==
// @name         Kiwix
// @namespace    https://github.com/lzybluee/Wiki
// @version      3.0
// @description  1. Redirect content url to viewer url. 2. Redirect 404 page to search url. 3. Press title text or 'w' key will link to online page.
// @author       Lzy
// @match        *://127.0.0.1:8080/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    if (window.self === window.top) {
        const url = window.location;
        if (!url.pathname.startsWith( '/content/')) return;

        const redirect_url = url.origin + '/viewer#' + url.pathname.slice('/content/'.length);
        console.log('Redirect to', redirect_url)
        url.replace(redirect_url);
    }

    if (document.title === 'Page not found' && !document.querySelector(`link[rel='canonical']`)) {
        const url = window.location;
        if (!url.pathname.startsWith( '/content/')) return;

        const path = url.pathname.slice('/content/'.length);
        const index = path.indexOf( '/');
        const bookname = path.slice(0, index);
        const pattern = path.slice(index + 1);

        const search_url = url.origin + '/search?books.name=' + bookname + "&pattern=" + pattern;
        console.log('Search url', search_url)
        url.replace(search_url);
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