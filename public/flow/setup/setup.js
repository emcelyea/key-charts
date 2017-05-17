(function(){
	var nameButton = document.getElementById('save-title-button');
	var nameInput = document.getElementById('name-input');

	var nameDisplay = document.getElementById('chart-name');
	var chartArea = document.getElementById('chart-div');
	var controller;

	var chartCreated = false;

	if(location.search && location.search.indexOf('chart') > -1){
		var chartId = location.search.split('=')[1];
	}

	//save name click listener
	nameButton.addEventListener('click', function(){
		if(nameInput.value){
			initChart(nameInput.value);
		}
	});
	//enter listener
	nameInput.addEventListener('keyup', function(evt){
		if(evt.keyCode === 13){
			if(nameInput.value){
				initChart(nameInput.value);				
			}
		}
	});

	function initChart(name){
		if(chartCreated){
			//update chart
		}else{
			nameDisplay.innerHTML = name;
			controller = new FlowchartController();
			controller.initialize('chart-div', name, (chartId || false) );
			chartCreated = true;
		}				
	}
})();

/* FOR NEXT TIME:::: INITIALIZE THE GOTDAMN MOFUKN DRAW STUFF */
/*	


if(chartId){
	controller.flowchart.read(chartId).then(function(){
		//controller
	});
}*/
