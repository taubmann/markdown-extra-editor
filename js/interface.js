/**	
 * Markdown-Extra Editor
 * Copyright (c) 2013 Christoph Taubmann
 * Licensed under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

var height =	("innerHeight" in window 
				? window.innerHeight
				: document.documentElement.offsetHeight)-40,
	mee_i = document.getElementById('input'),
	mee_o = document.getElementById('output'),
	live = (document.body.className=='both'),
	sc = true,
	shft = false;
	
mee_i.style.height = (height-20)+'px';
mee_o.style.height = (height-20)+'px';

function toggle(to)
{
	document.body.className = to;
	live = (to=='both');
	if (to=='preview') buildToc();
}

// inspired by: http://www.quirksmode.org/js/contents.html
function buildToc()
{
	
	var tagn = ['h1','h2','h3','h4','h5'],
		res = [];
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
	
	if (res.length>2)
	{
		var y = document.createElement('div');
			y.id = 'toc';
			y.innerHTML = '<i onclick="this.parentNode.style.display=\'none\'" style="float:right;cursor:pointer">&otimes;</i>';
		for (var i=0,j=res.length; i<j; ++i)
		{
			var tmp = document.createElement('a');
				tmp.innerHTML = res[i].innerHTML;
				y.appendChild(tmp);
				tmp.className += ' ind'+res[i].nodeName;
			var headerId = res[i].id || 'link' + i;
				tmp.href = '#' + headerId;
				res[i].id = headerId;
		}
		//alert(y.innerHTML);
		mee_o.appendChild(y);
	}
}


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

function transfer()
{
	if (!live) return;
	var html = Markdown(mee_i.value);
	if(sc) html = html.replace('<!--','<span class="comment icon-comment"><mee_i>').replace('-->','</mee_i></span>');
	mee_o.innerHTML = html;
	//alert(createTOC(mee_o));
};

mee_i.onkeydown = function(e)
{
	// see http://darklaunch.com/2009/02/03/javascript-insert-tabs-into-textarea-insert-tabs-into-input-javascript-tab-indent
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
			
			var pos = mee_i.selectionStart;
			var l = mee_i.value.substring(0, mee_i.selectionStart).split('\n').pop();
			var c = ['1. ','    1. ','\\* ','    \\* ','\\\t'];
			for (var i=0,j=c.length; i<j; ++i)
			{
				if (l.match(eval('/^'+c[i]+'/')))
				{i
					var s = c[i].replace('\\','');
					set('\n'+s, '');
					var co = s.length+1;
					mee_i.setSelectionRange(pos+co, pos+co);
					e.preventDefault();
				}
			};
			
		break;
		case 17: // ctrl: activate listener for keys below
			shft = true;
		break;
		default:
			// shortcuts for buttons (only activated in combination with ctrl)
			if (shft)
			{
				if(e.keyCode==66){ set('**','**'); }
				if(e.keyCode==73){ set('*','*'); }
				
				e.preventDefault();
				shft = false;
			}
		break;
		
	};
	//alert(e.keyCode)
	delayFunction(transfer, 500)
};
transfer();
