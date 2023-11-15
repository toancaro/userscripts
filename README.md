# userscripts
Scripts for TamperMonkey

## 1. Installation

### 1.1. Install TamperMonkey

Follow this link to add TamperMonkey extention to your Chrome browser:
https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

### 1.2. Add scripts to TamperMonkey

1. Open TamperMonkey dashboard from extention button, or you can open this URL:

   chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html
   
   ![Monosnap Image 2023-11-15 12-30-15](https://github.com/toancaro/userscripts/assets/3683223/ead5a3ed-8ea8-4d5d-9fe2-196d692f5cf8)
   
2. Navigate to Utilities tab, scroll down to "Import from URL", paste this URL into the textbox, then click "Install"
   
   https://raw.githubusercontent.com/toancaro/userscripts/main/lib/cardTextHighlight.js

   **IMPORTANT**: ONLY INSTALL SCRIPTS FROM THE SOURCES YOU TRUST!!!
   You can find source code of above script from this Github repository.
   
   ![Monosnap Image 2023-11-15 12-36-30](https://github.com/toancaro/userscripts/assets/3683223/26bfe35d-f8d1-420a-aa94-93eded381d36)

3. Click "Install" on the newly opened window

   ![image](https://github.com/toancaro/userscripts/assets/3683223/6568b9ab-187c-4373-b7e8-2d6128c4326e)

4. You can see the installed scripts in the "Installed Userscripts" tab
   ![image](https://github.com/toancaro/userscripts/assets/3683223/7331f27b-18bd-4c7a-9610-5a70ab4c186d)

5. That's all. You now can test the result on the https://www.masterduelmeta.com/top-cards site.

## 2. Contribute

1. In the root project, run: "npm install"
2. Run "npm run serve" to build and watch ts file changes.
3. You can use @require in ==UserScript== section to load local file (require "Allow access to file URLs" enabled in Chrome extensions settings chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo)

## 3. License

MIT
