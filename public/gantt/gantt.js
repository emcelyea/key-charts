

//sinit();

function init(){
	addTitleCreateListener('title-create-button');
}

function addTitleCreateListener(buttonId){
	var button = document.getElementById(buttonId);
	button.addEventListener('click', function(){
		var title = document.getElementById('title-input').value;
		if(title.length > 0){
			var ganttData = new Gantt();
			ganttData.create(title, function(err, success){
				if(err){
					alert(err);
				}else{
					setChartTitle(title);
					shiftView('title-view', 'create-view');

				}
			});
		}
	});
}

function setChartTitle(title){
	var chartTitle = document.getElementById('chart-title-display'); 
	chartTitle.innerHTML = title;
}
function shiftView(view1, view2){
	view1 = document.getElementById(view1);
	view2 = document.getElementById(view2);

	view1.style.display = 'none';
	view2.style.display = 'block';
}