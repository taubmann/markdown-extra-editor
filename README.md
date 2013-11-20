# Markdown-Extra Editor

	ver. 0.9.0

Based on a 
[JavaScript port](https://github.com/tanakahisateru/js-markdown-extra) 
of 
[PHP Markdown Extra](http://michelf.ca/projects/php-markdown/extra) 
this Editor provides a lean Interface to Edit your 
[Markdown](http://daringfireball.net/projects/markdown)-Documents. 

With Support for Footnotes, Tables, Abbreviations etc. Markdown-Extra is a perfect choice to write even scientific Texts.

### Features

* switchable Split-Window (Editor | HTML-Preview | both)
* Fast even on long Documents (by deactivating auto-transcoding at some length)
* works on Mobile Devices
* plain Vanilla-JS (faster than using Libs)
* Auto-Indentation / Auto-Completition for Lists, Tabs, ... (i missed that!)
* "Table of Contents" in Preview for customizable Elements (Headings, Comments, Quotes, ...)
* synchronized scrolling
* HTML-Comments are shown as Tooltip <!-- i like to comment my texts -->
* easy extendible (simple to understand) and embeddable in your Web-Apps

### Why?

#### Why  Markdown?

* Markdown is beautiful and easily to understand
* WYSIWYM is way more suitable for distraction-free writing (don’t waste time formatting your text while writing)
* no Incompatibilities between strange file formats from strange companies ;-)

*[WYSIWYM]: "What you see is what you mean"

#### Why use your Browser as Editor?

* to edit Online-Texts without downloading (Editor integrated in a CMS)
* Spellcheck on Textareas is integrated
* Browser is also usable as an Offline-Editor (see Tips) and saving online possible
* your Browser is open anyway ;-)
* no additional Installation required

### Credits

* Transcoder: [js-markdown-extra](//github.com/tanakahisateru/js-markdown-extra)
* Icons: [Font Awesome](http://fontawesome.io) via [Fontello](http://fontello.com)
* Table of Contents inspired by: [quirksmode.org](http://www.quirksmode.org/js/contents.html)

### Tips

* [this Firefox-extension](https://addons.mozilla.org/en-US/firefox/addon/save-text-area) "adds File Open and Save functionality to editable text fields and areas, in effect turning them into notepads." Install, right-click into the Edit-Area: "Text">"Load from File". Once a Text is loaded Ctrl+S will work as well!!
* Turn your Browser to Fullscreen to concentrate on writing.
* If you want to transform Markdown(-Extra) into something else (like PDF, Openoffice or Word, etc.) have a look at the Swiss-Army Knife for Markdown [Pandoc](http://johnmacfarlane.net/pandoc)
* If [Zotero for Firefox](https://www.zotero.org) is installed directly in your Browser you have a Reference-Manager at your Fingertips
* To adapt the Menu-Items just edit the Menu-JSON found at the bottom of markdown-extra-editor.js on <http://jsoneditoronline.org>
* to manage the Icons found in font/ go to <http://fontello.com>

### Limitations

* Javascript must be activated
* IE less than 9 is (will) not be supported
* atm JS-Markdown-Extra is based on PHP Markdown Extra 1.2.5, so some fancy new Markup are missing


