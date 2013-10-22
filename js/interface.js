/**	
* Markdown-Extra Editor
* Copyright (c) 2013 Christoph Taubmann
* Licensed under the MIT License
* http://www.opensource.org/licenses/mit-license.php
*/

// set the initial editor-mode ( preview, editor, both )
document.body.className = 'both';

var mee_i = document.getElementById('input'),
	mee_o = document.getElementById('output'),
	live = (document.body.className=='both'),// auto-transcode
	sc = true,// show comments
	ctrl = false;// ctrl was pressed

function init()
{
	var css = document.createElement('style'),
		styles = '#input, #output { height: '+(window.innerHeight-70)+'px; width: '+((window.innerWidth/2)-15)+'px; }';
		css.type = 'text/css';
	if(css.styleSheet){ css.styleSheet.cssText = styles; }
	else{ css.appendChild(document.createTextNode(styles)); }
	document.getElementsByTagName("head")[0].appendChild(css);
}


window.onresize = init;

// synchronize scrolling
mee_i.onscroll = function(){ mee_o.scrollTop = mee_i.scrollTop }

// toggle split-screen
function toggle(to)
{
	document.body.className = to;
	live = (to=='both');
	if (to=='preview') buildToc();
}

function toggleComments()
{
	sc = !sc;
	alert('Comments are '+(sc?'activated':'deactivated'));
	if(sc) buildToc(['span']);
}

// create table of contents inspired by: http://www.quirksmode.org/js/contents.html
function buildToc(tags)
{
	
	var tagn = (tags ? tags : ['h1','h2','h3','h4','h5']),
		res  = [];
	transfer();
	for (var i=0,j=tagn.length; i<j; ++i)
	{
		var tags = mee_o.getElementsByTagName(tagn[i]);
		for (var k=0,l=tags.length; k<l; ++k)
		{
			res.push(tags[k]);
		}
	}
	var testNode = res[0];
	if (!testNode) return [];
	if (testNode.sourceIndex)
	{
		res.sort(function (a,b)
		{
			return a.sourceIndex - b.sourceIndex;
		});
	}
	else if (testNode.compareDocumentPosition)
	{
		res.sort(function (a,b)
		{
			return 3 - (a.compareDocumentPosition(b) & 6);
		});
	}
	
	if (res.length>0)
	{
		var y = document.createElement('div');
			y.id = 'toc';
			y.innerHTML = '<i onclick="this.parentNode.style.display=\'none\'" style="float:right;cursor:pointer">&otimes;</i>';
		for (var i=0,j=res.length; i<j; ++i)
		{
			var tmp = document.createElement('a'),
				ih = res[i].title || res[i].innerHTML;
				tmp.innerHTML = ih.substring(0,30);
				y.appendChild(tmp);
				tmp.className += ' ind'+res[i].nodeName;
			var headerId = res[i].id || 'link' + i;
				tmp.href = '#' + headerId;
				res[i].id = headerId;
		}
		mee_o.appendChild(y);
	}
}

function insertTable()
{
	var cols = prompt('how many columns do you need?','3'),
		rows = prompt('how many rows do you need?','3');
	var rh = [], rl = [], rb = [];
	for (i=0,j=parseInt(cols); i<j; ++i)
	{
		rh.push('    Header    ');
		rl.push('--------------');
		rb.push(' Cell Content ');
	}
	var str = "\n" + rh.join('|') + "\n" + rl.join('|');
	for (i=0,j=parseInt(rows); i<j; ++i)
	{
		str += "\n" + rb.join('|');
	}
	set('', str);
}

// wrap formatting around selected Text
function set(before, after, multiline)
{
	var s = mee_i.selectionStart, 
		e = mee_i.selectionEnd,
		v = mee_i.value,
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
	mee_i.value = b + v.substring(e, v.length);
	transfer();
	mee_i.focus();
	mee_i.setSelectionRange(pos, pos);
	
};

// delay for function transfer
function delayTimer()
{
	var timer;
	return function(fun, time)
	{
		clearTimeout(timer);
		timer = setTimeout(fun, time);
	};
};
var delayFunction = delayTimer();

// transcode Markdown to HTML
function transfer(enforce)
{
	if (!live) return;
	var v = mee_i.value;
	if(enforce) mee_o.innerHTML = '<b>regenerate Markdown, please wait...</b>';
	
	// if the Text is too big we should deactivate "background-transcoding"
	if (!enforce && v.length>10000) return;
	var html = Markdown(v);
	
	// encode html-comments as bubbles
	if(sc) html = html.replace(/<!--(.*)-->/g, '<span class="icon-comment" title="$1"></span>');
	mee_o.innerHTML = html;
};

function showSource()
{
	var p = document.createElement('pre');
		p.textContent = mee_o.innerHTML;
	mee_o.innerHTML = '';
	mee_o.appendChild(p);
}

// capture key-codes
mee_i.onkeydown = function(e)
{
	switch(e.keyCode)
	{
		case 9: // tab: insert tab
			e.preventDefault();
			var pos = mee_i.selectionStart;
			set('\t','');
			mee_i.setSelectionRange(pos+1, pos+1);
			return;
		break;
		case 13: // enter: check/set auto-indetation for some line-starts
			
			var pos = mee_i.selectionStart,
				l = mee_i.value.substring(0, mee_i.selectionStart).split('\n').pop(),
				c = ['1. ','    1. ','\\* ','    \\* ','\\\t'];
			for (var i=0,j=c.length; i<j; ++i)
			{
				if (l.match(eval('/^'+c[i]+'/')))
				{
					var s = c[i].replace('\\',''),
						co = s.length+1;
					set('\n'+s, '');
					mee_i.setSelectionRange(pos+co, pos+co);
					e.preventDefault();
				}
			};
			
		break;
		case 17: // ctrl: activate listener for keys below
			ctrl = true;
		break;
		default:
			if (ctrl) // shortcuts for buttons (only activated in combination with ctrl)
			{
				// detect ctrl+SOMETHING: here you can add some custom checks
				if(e.keyCode==66){ set('**','**');e.preventDefault(); }// b => bold
				if(e.keyCode==73){ set('*','*');e.preventDefault(); }// i => italics
				if(e.keyCode==72){ transfer(true); e.preventDefault(); }// h => regenerate HTML-Output
				if(e.keyCode==49){ toggle('editor');e.preventDefault(); }// 1 => show Editor-Mode
				if(e.keyCode==50){ toggle('both');e.preventDefault(); }// 2 => show Splitscreen-Mode
				
				ctrl = false; // reset ctrl-Listener
			}
		break;
	};
	// alert(e.keyCode)
	
	// delay transfer by 1.5 sec
	delayFunction(transfer, 1500)
};

// 
init();
transfer();
