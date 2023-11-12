import * as esbuild from 'esbuild';

const jsBanner = () => {
  const text = `
    // ==UserScript==
    // @name         MDM: Card Text Highlight
    // @namespace    http://toancaro.com
    // @version      0.1
    // @description  Add highlight colors to card text.
    // @author       You
    // @match        https://*.masterduelmeta.com/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=masterduelmeta.com
    // @grant        GM.addStyle
    // @grant        GM.notification
    // @grant        GM.registerMenuCommand
    // @grant        unsafeWindow
    // @run-at       document-idle
    // @require      https://code.jquery.com/jquery-3.7.1.slim.min.js#sha256-kmHvs0B+OpCW5GVHUNjv9rOmY0IvSIRcf7zGUDTDQM8=
    // ==/UserScript==
  `;

  return text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
};

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'browser',
  outfile: 'out.js',
  banner: { js: jsBanner() },
  external: ['lodash'],
});
