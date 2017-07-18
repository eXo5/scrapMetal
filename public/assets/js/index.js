//index.js
$(document).ready(function(){
		
		$.getJSON("/scrape", function(data){
			for (var i = 0; i < data.length; i++ ){
				$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
			}
		})

		// $.each(function(i, element){
		// 	$("<p>" + title + "\n" + link + "</p>");
		// })
})