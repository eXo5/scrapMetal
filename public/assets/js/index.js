//index.js
$(document).ready(function(){
		
		$.getJSON("/articles", function(data){
			console.log(data);
			for (var i = 0; i < data.length; i++ ) {
				$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href='"+ data[i].link + "'>" + data[i].link + "</a></p>");
			};
		});

		$(document).on("click", "p", function() {
			$("#comments").empty();
			var thisId = $(this).attr("data-id");
			console.log(thisId);
			$("#comments").append("<h2>" + data.title + "</h2>");
		})

		// $.each(function(i, element){
		// 	$("<p>" + title + "\n" + link + "</p>");
		// })
})