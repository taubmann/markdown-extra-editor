
/*
* nice toc-script from http://www.quirksmode.org
* http://www.quirksmode.org/js/contents.html
*/

function getElementsByTagNames(list, obj)
{
	if (!obj) var obj = document;
	var tagNames = list.split(',');
	var resultArray = [];
	for (var i=0;i<tagNames.length; i++)
	{
		var tags = obj.getElementsByTagName(tagNames[i]);
		for (var j=0;j<tags.length;j++)
		{
			resultArray.push(tags[j]);
		}
	}
	var testNode = resultArray[0];
	if (!testNode) return [];
	if (testNode.sourceIndex)
	{
		resultArray.sort(function (a,b) {
				return a.sourceIndex - b.sourceIndex;
		});
	}
	else if (testNode.compareDocumentPosition)
	{
		resultArray.sort(function (a,b) {
				return 3 - (a.compareDocumentPosition(b) & 6);
		});
	}
	return resultArray;
}

function createTOC(el)
{
	var y = document.createElement('div');
	y.id = 'innertoc';
	var a = y.appendChild(document.createElement('span'));
	a.onclick = showhideTOC;
	a.id = 'contentheader';
	a.innerHTML = 'table of contents';
	var z = y.appendChild(document.createElement('div'));
	z.style.display = 'none';
	z.onclick = showhideTOC;
	var toBeTOCced = getElementsByTagNames('h2,h3,h4,h5', el);
	
	if (toBeTOCced.length < 2) return false;

	for (var i=0,j=toBeTOCced.length; i<j; ++i)
	{
		var tmp = document.createElement('a');
		tmp.innerHTML = toBeTOCced[iy].innerHTML;
		tmp.className = 'page';
		z.appendChild(tmp);
		tmp.className += ' ind'+toBeTOCced[i].nodeName;
		var headerId = toBeTOCced[i].id || 'link' + i;
		tmp.href = '#' + headerId;
		toBeTOCced[i].id = headerId;
	}
	return y;
}

var TOCstate = 'none';

function showhideTOC()
{
	TOCstate = (TOCstate == 'none') ? 'block' : 'none';
	var newText = (TOCstate == 'none') ? 'table of contents' : 'hide table of contents';
	document.getElementById('contentheader').innerHTML = newText;
	document.getElementById('innertoc').lastChild.style.display = TOCstate;
}
