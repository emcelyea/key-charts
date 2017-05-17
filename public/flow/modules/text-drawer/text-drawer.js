

var textDrawerError = 'TextDrawer Error : ';

var TextDrawer = function(){};

TextDrawer.fontSize = "14";
TextDrawer.fontFamily = "Serif";
TextDrawer.textPadding = "10";

//initialize with coords of a node so it knows how to draw overlays
TextDrawer.prototype.initialize = function(svg){
	this.svg = svg;
	this.textSizes = TextDrawer.buildTextSizeReferenceObject(TextDrawer.fontSize, TextDrawer.fontFamily);
}

//keypress listener 
//will draw key immediately, then run more intensive redraw operation after 200ms,
//not responsive enough if you run redraw every time
TextDrawer.prototype.updateText = function(node, coords, evt){
	if(!this.drawingText){
		this.drawingText = true;
		//element already exists, fast draw text
		if(node.textElement){
			if(evt.keyCode === 8){
				node.textElement.lastChild.innerHTML = node.textElement.lastChild.innerHTML.slice(0,node.textElement.lastChild.innerHTML.length-1);
			}else{
				node.textElement.lastChild.innerHTML += evt.key;
			}
			if(node.textElementBackground){
				addWhiteBackground(node, this.svg);
			}
			if(node.redrawTimeout){
				clearTimeout(node.redrawTimeout);
			}
			//redraw text
			node.redrawTimeout = setTimeout( () => {
				var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('font-family', TextDrawer.fontFamily);
				text.setAttribute('font-size', TextDrawer.fontSize);

				var textVariables = this.getTextCoords(coords, node.content);

				text.setAttribute('x', textVariables.x);
				text.setAttribute('y', textVariables.y);
				for(var i = 0; i < textVariables.children.length; i++){
					text.appendChild(textVariables.children[i]);
				}
				this.svg.removeChild(node.textElement);
				node.textElement = text;
				if(node.type === 'line-horizontal' || node.type === 'line-vertical'){
					this.svg.removeChild(node.textElementBackground);
					addWhiteBackground(node, this.svg);
				}				
				this.svg.appendChild(node.textElement);			
			}, 200);

		//draw text for first time
		}else{
			var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('font-family', TextDrawer.fontFamily);
			text.setAttribute('font-size', TextDrawer.fontSize);

			var textVariables = this.getTextCoords(coords, node.content);

			text.setAttribute('x', textVariables.x);
			text.setAttribute('y', textVariables.y);
			for(var i = 0; i < textVariables.children.length; i++){
				text.appendChild(textVariables.children[i]);
			}
			node.textElement = text;
			//draw white behind text
			if(node.type === 'line-horizontal' || node.type === 'line-vertical'){
				addWhiteBackground(node, this.svg);
			}
			this.svg.appendChild(node.textElement);			
		}
		this.drawingText = false;
	}
}
function addWhiteBackground(node, svg){
	if(!node.textElementBackground)
		node.textElementBackground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	var bBox = node.textElement.getBBox();
	node.textElementBackground.setAttribute("x", bBox.x);
	node.textElementBackground.setAttribute("y", bBox.y);
  node.textElementBackground.setAttribute("width", bBox.width);
  node.textElementBackground.setAttribute("height", bBox.height);
  node.textElementBackground.setAttribute("fill", "white");
  svg.appendChild(node.textElementBackground);
}
//for regular drawing of node
TextDrawer.prototype.drawText = function(coords, node){
	var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	text.setAttribute('font-family', TextDrawer.fontFamily);
	text.setAttribute('font-size', TextDrawer.fontSize);

	var textVariables = this.getTextCoords(coords, node.content || '');

	text.setAttribute('x', textVariables.x);
	text.setAttribute('y', textVariables.y);
	for(var i = 0; i < textVariables.children.length; i++){
		text.appendChild(textVariables.children[i]);
	}
	node.textElement = text;
	this.svg.appendChild(node.textElement);				
}
//returns object with variables necessary to draw multi-line text elem
TextDrawer.prototype.getTextCoords = function(coords, content){
	var textLength = 0;
	for(let i = 0; i < content.length; i++){
		textLength += this.textSizes[content[i]] || 0;
	}

	//calculate # tspans needed
	var tspans = [];
	var width = coords.x1 - coords.x0;
	var height = coords.y1 - coords.y0;
	var midpointX = coords.x0 + width/2;
	var midpointY = coords.y0 + height/2;

	var linesNeeded = textLength/width;
	linesNeeded = linesNeeded >= 1 ? Math.ceil(linesNeeded) : 1;
	
	var lineWidth = linesNeeded > 1 ? width - (2 * Number(TextDrawer.textPadding)) : textLength;
	var pointX = midpointX - lineWidth/2;
	var pointY = midpointY - linesNeeded/2 * (Number(TextDrawer.fontSize) * 1.2); 
	
	//create tspan elements	
	for(let i = 0; i < linesNeeded; i++){
		tspans.push(document.createElementNS('http://www.w3.org/2000/svg', 'tspan'));
		tspans[i].setAttribute('x', pointX);
		tspans[i].setAttribute('dy', '1.2em');
		let sliceIndex = this.getSliceIndex(content, Math.ceil(textLength/linesNeeded));
		let stringContent = content.slice(0, sliceIndex);
		content = content.replace(stringContent, '');
		tspans[i].innerHTML = stringContent;
	}

	//return attributes needed to draw text element
	return {y:pointY, x:pointX, children:tspans};
	
}

//build an object that references character size for family/size
TextDrawer.buildTextSizeReferenceObject = function(fontsize, fontfamily){
	var charRef = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ 1234567890-=`!@#$%^&*()_+~[]\\;\',./{}|:"<>?';
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	ctx.font = fontsize + 'px ' + fontfamily;
	var sizeRef = {};

	for(var i = 0; i < charRef.length; i++){
		sizeRef[charRef[i]] = ctx.measureText(charRef[i]).width;
	}
	return sizeRef;
}

//returns index where text[index+1] > width or text.length - 1; 
TextDrawer.prototype.getSliceIndex = function(text, width){
	let textLength = 0;
	for(let i = 0; i < text.length; i++){
		textLength += this.textSizes[text[i]] || 0;
		if(textLength > width){
			return i - 1;
		}
	}
	return text.length;	
}

