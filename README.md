# Markdown-Extra Editor

	ver. 0.6.2

Based on a 
[JavaScript port](//github.com/tanakahisateru/js-markdown-extra) 
of 
[PHP Markdown Extra](http://michelf.ca/projects/php-markdown/extra) 
this Editor provides a lean Interface to Edit your 
[Markdown](http://daringfireball.net/projects/markdown)-Documents. 

With Support for Footnotes, Tables Abbreviations etc. Markdown-Extra is a perfect choice to write even scientific Texts.

### Features

* Fast even on long Documents (by deactivating auto-transcoding)
* plain Vanilla-JS (even faster)
* Auto-Indentation / Auto-Completition for Lists, Tabs, ... (i missed that!)
* switchable Split-Window (Editor | HTML-Preview | both) 
* "Table of Contents" in Preview
* synchronized scrolling
* HTML-Comments are shown as Tool-tip <!--i like to comment my Texts -->
* easy extendible (simple to understand)

### Why?

#### Why  Markdown?

* Markdown is beautiful and easily to understand
* WYSIWYM is way more suitable for distraction-free writing (don’t waste time formatting your text while writing)
* no Incompatibilities between strange file formats from strange companies

*[WYSIWYM]: "What you see is what you mean"

#### Why use your Browser as Editor?

* Spellcheck on Textareas is integrated
* also usable as Offline-Editor (see Tips) and saving online possible
* mostly your Browser is open anyway ;-)
* no additional Installation required


### Credits

* Transcoder: [js-markdown-extra](//github.com/tanakahisateru/js-markdown-extra)
* Icons: [Font Awesome](http://fontawesome.io)
* Table of Contents inspired by: [quirksmode.org](http://www.quirksmode.org/js/contents.html)

### Tips

* [this](https://addons.mozilla.org/en-US/firefox/addon/save-text-area) Firefox-extension "adds File Open and Save functionality to editable text fields and areas, in effect turning them into notepads." Install, right-click into Edit-Area: "Text">"Load from File". Once a Text is loaded Ctrl+S will work as well!!
* "F11" will turn your Browser Fullscreen. So you can concentrate on writing.
* If you want to transform Markdown(-Extra) into something else (like PDF, Openoffice or Word, etc.) have a look at the Swiss-Army Knife for Markdown [Pandoc](http://johnmacfarlane.net/pandoc)
* If [Zotero for Firefox](https://www.zotero.org) is installed directly in your Browser you have a Reference-Manager at your Fingertips.

### Limitations

* Javascript must be activated
* IE less than 9 is (will) not be supported
* atm JS-Markdown-Extra is based on PHP Markdown Extra 1.2.5, so some fancy new Markup are missing


