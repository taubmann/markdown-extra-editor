/**	
* Markdown-Extra Editor
* Copyright (c) 2013 Christoph Taubmann
* Licensed under the MIT License
* http://www.opensource.org/licenses/mit-license.php
*/
(function(w, d, undefined)
{

	w.mee = function(){};

	mee.prototype.init = function (id, opts)
	{
		var that = this;
		
		this.ctrl = false;
		
		this.showComments = true;
		
		this.timeout = null;
		this.containerid = id;
		this.container = d.getElementById(id);
		
		this.live = true;
		
		this.touch = ('ontouchstart' in d.documentElement);
		if(opts)
		{
			for (e in opts) this.options[e] = opts[e];
		}
		this.container.className = 'mee_container '+(this.touch?'editor':'both');
		
		// create+append teh menu
		this.container.appendChild(this[this.touch?'buildMenuSelect':'buildMenu'](this.options.menu, true));
		
		var t = this.container.getElementsByTagName('textarea');
		this.ta = (t[0]) ? t[0] : d.createElement('TEXTAREA');
		
		//this.ta = d.createElement('TEXTAREA');
		this.ta.className = 'mee_input';
		
		that.ta.onkeydown = function(e)
		{
			
			switch(e.keyCode)
			{
				case 9: // tab: insert tab
					e.preventDefault();
					var pos = this.selectionStart;
					that.format(that,'\t','');
					this.setSelectionRange(pos+1, pos+1);
					return;
				break;
				case 13: // enter: check/set auto-indetation for some line-starts
					
					var pos = this.selectionStart,
						l = this.value.substring(0, this.selectionStart).split('\n').pop(),
						c = ['1. ','    1. ','\\* ','    \\* ','\\\t'];
					
					for (var i=0,j=c.length; i<j; ++i)
					{
						if (l.match(eval('/^'+c[i]+'/')))
						{
							var s = c[i].replace('\\',''),
								co = s.length+1;
							that.format(that,'\n'+s, '');
							this.setSelectionRange(pos+co, pos+co);
							e.preventDefault();
						}
					};
					
				break;
				case 17: // ctrl: activate listener for keys below
					that.ctrl = true;
				break;
				default:
					if (that.ctrl) // shortcuts for buttons (only activated in combination with ctrl)
					{
						// detect ctrl+SOMETHING: here you can add some custom checks
						if(e.keyCode==66){ that.format(that,'**','**');e.preventDefault(); }// b => bold
						if(e.keyCode==73){ that.format(that,'*','*');e.preventDefault(); }// i => italics
						if(e.keyCode==72){ that.transfer(that,true); e.preventDefault(); }// h => regenerate HTML-Output
						if(e.keyCode==49){ that.toggleScreens('editor');e.preventDefault(); }// 1 => show Editor-Mode
						if(e.keyCode==50){ that.toggleScreens('both');e.preventDefault(); }// 2 => show Splitscreen-Mode
						
						that.ctrl = false; // reset ctrl-Listener
					}
				break;
			};
			// alert(e.keyCode)
			
			// delay transfer by 1.5 sec
			if(that.timeout != null) w.clearTimeout(that.timeout);
			that.timeout = w.setTimeout(function(){that.transfer(that)}, 1500);
			
		};//onkeydown END
		
		this.ta.onscroll = function(){ that.pv.scrollTop = this.scrollTop }
		

		//this.ta.setAttribute('style','width:48%;height:50%;float:left');
		this.container.appendChild(this.ta);
		
		this.pv = d.createElement('DIV');
		this.pv.className = 'mee_preview';
		
		//this.pv.onscroll = function(){ that.ta.scrollTop = this.scrollTop }
		//this.pv.setAttribute('style','width:49%;height:50%;border:1px solid #000;float:left');
		this.container.appendChild(this.pv);
		
		
		that.transfer(that);
	};//init END


	// create the Menu as unordered List
	mee.prototype.buildMenu = function(nodes, start)
	{
		var ul = d.createElement('UL');
		if(start) ul.className = 'mee_menu';
		for (var i=0,j=nodes.length; i<j; ++i)
		{
			ul.appendChild(this.buildMenuItem(nodes[i]));
		}
		return ul;
	};
	mee.prototype.buildMenuItem = function(node)
	{
		var that = this;
		var li = document.createElement('LI');
			li.title = node.title;
			
			if(node.icon && node.icon.length>2)
			{
				li.className = 'icon-'+node.icon;
			}
			else
			{
				li.innerHTML = node.title;
				li.className = node.icon;
			}
			
			if(node.func)
			{
				li.onclick = function()
				{
					// add the Objet to the Parameter-Array
					node.params.unshift(that);
					that[node.func].apply(this, node.params);
				}
			}
			if(node.sub) li.appendChild(this.buildMenu(node.sub));
		return li;
	};
	
	// create the Menu as Select-List
	mee.prototype.buildMenuSelect = function(nodes, start)
	{
		this.menuFunctions = {};
		var that = this;
		if (start)
		{
			this.sel = d.createElement('SELECT');
			this.sel.className = 'mee_select';
			this.sel.onchange = function()
			{
				var f = that.menuFunctions[this.value]['func'],
					p = that.menuFunctions[this.value]['params'];
					p.unshift(that);
				that[f].apply(this, p);
			}
		}
		for (var i=0, j=nodes.length; i<j; ++i)
		{
			this.sel.appendChild(this.buildMenuOption(nodes[i], i));
		}
		return this.sel;
	};
	mee.prototype.buildMenuOption = function(node, no)
	{
		if (node.sub)
		{
			var o = document.createElement('OPTGROUP');
				o.label = node.title;
			for (var i=0,j=node.sub.length; i<j; ++i)
			{
				o.appendChild(this.buildMenuOption(node.sub[i], no+'_'+i));
			}
			return o;
		}
		else
		{
			var o = document.createElement('OPTION');
				o.innerHTML = node.title;
				
				if(node.func)
				{
					o.value = no;
					this.menuFunctions[no] = {};
					this.menuFunctions[no]['func'] = node.func;
					this.menuFunctions[no]['params'] = node.params;
				}
				else
				{
					o.value = '';
				}
			return o;
		}
	};
	
	// wrap formatting around selected Text
	mee.prototype.format = function(obj, before, after, multiline, offset)
	{
		
		var s = obj.ta.selectionStart, 
			e = obj.ta.selectionEnd,
			v = obj.ta.value,
			m = v.substring(s,e);
		
		if (before.length==0 && after.length==0)
		{
			m = m.replace(/\*/g,'').replace(/#/g,'').replace(/\n\s{1,}/g,'\n');
		}
		
		if (multiline)
		{
			m = m.replace(/\n/g, '\n'+before);
		}
		var b = v.substring(0,s) + before + m + after,
			pos = b.length;
		
		obj.ta.value = b + v.substring(e, v.length);
		obj.transfer(obj);
		obj.ta.focus();
		//pos += offset || 0;
		obj.ta.setSelectionRange(pos, pos);
		
	};

	mee.prototype.insertTable = function(obj)
	{
		var cols = prompt('how many columns do you need?','3'),
			rows = prompt('how many rows do you need?','3');
		var rh = [], rl = [], rb = [];
		for (i=0,j=parseInt(cols); i<j; ++i)
		{
			rh.push('Header        ');
			rl.push('--------------');
			rb.push(' Cell Content ');
		}
		var str = "\n" + rh.join('|') + "\n" + rl.join('|');
		for (i=0,j=parseInt(rows); i<j; ++i)
		{
			str += "\n" + rb.join('|');
		}
		obj.format(obj, '', str);
	};

	// transcode Markdown to HTML
	mee.prototype.transfer = function(obj, enforce)
	{
		
		if (!obj.live) return;
		var v = obj.ta.value;
		
		if (enforce) obj.pv.innerHTML = '<b>regenerate Markdown, please wait...</b>';
		
		// if the Text is too big we should deactivate "background-transcoding"
		if (!enforce && v.length>(obj.touch?2000:10000)) return;
		var html = Markdown(v);
		
		// encode html-comments as bubbles
		if(obj.showComments) html = html.replace(/<!--(.*)-->/g, '<span class="icon-comment" title="$1"></span>');
		obj.pv.innerHTML = html;
	};

	mee.prototype.toggleScreens = function(obj, to)
	{
		obj.container.className = 'mee_container mee_mode_'+to;
		obj.live = (to=='both');
		if (to=='preview') obj.buildToc(obj,['h1','h2','h3','h4','h5']);
	};
	
	

	// create table of contents inspired by: http://www.quirksmode.org/js/contents.html
	mee.prototype.buildToc = function(obj, tags)
	{
		
		var res  = [];
		obj.transfer(obj);
		
		for (var i=0, j=tags.length; i<j; ++i)
		{
			var els = document.querySelectorAll('#'+obj.containerid+' .mee_preview '+tags[i]);
			for (var k=0,l=els.length; k<l; ++k)
			{
				res.push(els[k]);
			}
		}
		var testNode = res[0];
		if (!testNode) return [];
		if (testNode.sourceIndex)
		{
			res.sort (function (a,b)
			{
				return a.sourceIndex - b.sourceIndex;
			});
		}
		else if (testNode.compareDocumentPosition)
		{
			res.sort (function (a,b)
			{
				return 3 - (a.compareDocumentPosition(b) & 6);
			});
		}
		
		if (res.length > 0)
		{
			
			var y = document.createElement('div');
				y.className = 'mee_tocdiv';
				y.innerHTML = '<i onclick="this.parentNode.style.display=\'none\'" style="float:right;cursor:pointer">&otimes;</i>';
			
			for (var i=0,j=res.length; i<j; ++i)
			{
				var tmp = document.createElement('a'),
					div = document.createElement('div'),
					ih = res[i].title || res[i].innerHTML;
					div.innerHTML = ih;
					ih = div.textContent || div.innerText || 'Item '+i;
					
					tmp.innerHTML = ih.substring(0,30);
					y.appendChild(tmp);
					tmp.className += ' ind'+res[i].nodeName;
				var headerId = res[i].id || 'mee_tocref' + i;
					tmp.href = '#' + headerId;
					res[i].id = headerId;
			}
			obj.pv.appendChild(y);
		}
	};
	
	mee.prototype.showSource = function(obj)
	{
		var p = document.createElement('pre');
			p.textContent = obj.pv.innerHTML;
		obj.pv.innerHTML = '';
		obj.pv.appendChild(p);
	};

///////////////////// Options ///////////////////////

// to manage it easily just copy&paste the JSON to/from      http://jsoneditoronline.org

mee.prototype.options = {

menu:
// Menu-JSON BEGIN

[{"title":"Heading","icon":"np","sub":[{"title":"H1","func":"format","params":["# ",""]},{"title":"H2","func":"format","params":["## ",""]},{"title":"H3","func":"format","params":["### ",""]},{"title":"H4","func":"format","params":["#### ",""]},{"title":"H5","func":"format","params":["##### ",""]}]},{"title":"Edit-Mode","sub":[{"title":"dual-column-Mode (ctrl+2)","icon":"columns","func":"toggleScreens","params":["both"]},{"title":"editing-Mode (ctrl+1)","icon":"edit","func":"toggleScreens","params":["editor"]},{"title":"preview-Mode","icon":"eye-open","func":"toggleScreens","params":["preview"]}]},{"title":"format Bold (ctrl+b)","icon":"bold np","func":"format","params":["**","**"]},{"title":"format Italic (ctrl+i)","icon":"italic np","func":"format","params":["*","*"]},{"title":"unordered List","icon":"list-ul np","func":"format","params":["* ","","true"]},{"title":"ordered List","icon":"list-ol np","func":"format","params":["1. ","","true"]},{"title":"indent 4 Spaces","icon":"indent-right np","func":"format","params":["    ","","true"]},{"title":"insert Table","icon":"table","func":"insertTable","params":["true"]},{"title":"remove Formatting","icon":"ban-circle np","func":"format","params":["","","true"]},{"title":"show Source","icon":"paper-clip ne","func":"showSource","params":["true"]},{"title":"ToC","icon":"ne","sub":[{"title":"Headings","func":"buildToc","params":[["h1","h2"]]},{"title":"Comments","func":"buildToc","params":[["span.icon-comment"]]},{"title":"Quotes","func":"buildToc","params":[["code"]]}]}]

// Menu-JSON END

// Language-Labels
,labels:

{
	"dada": "dsaf"
}

}// options END

})( window, document );
