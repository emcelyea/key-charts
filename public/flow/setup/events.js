
(function(){
	function optimizeEvent(event, customEvent, delay){

		var waiting = false;
		window.addEventListener(event, function () {
			if(waiting){
				clearTimeout(waiting);
			}
			setTimeout(function(){
				window.dispatchEvent(new CustomEvent(customEvent));
			}, delay);
		});
	}
	//optimizedResize
	optimizeEvent('resize', 'optimizedResize', 333);
})();

