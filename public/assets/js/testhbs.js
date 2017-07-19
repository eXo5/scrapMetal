//index.js
$(document).ready(function(){
		
		// $.getJSON("/articles", function(data){

		// 	console.log(data);
		// 	for (var i = 0; i < data.length; i++ ) {
		// 		$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href='"+ data[i].link + "'>" + data[i].link + "</a></p>");
		// 	};
		// });

		$(document).on("click", "p", function() {
			$("#comments").empty();
			var thisId = $(this).attr("data-id");
			$.ajax({
				method:"GET",
				url: "/articles/" + thisId
			})
			.done(function(data){
			$("#comments").append("<h5>" + data.title + "</h5><br>");
			$("#comments").append('<div class="row"><form class="col s12" name="newComment" method="POST" action="/articles/' + data._id + '"><zdiv class="row"><div class="input-field col s12"><input name="author" id="author" type="text" class="validate"><label for="author">Author</label></div></div><br><div class="row"><div class="input-field col s12"><textarea name="comment" id="comment" class="materialize-textarea"></textarea><label for="comment">Comment</label></div><button class="submit" data-id="' + data._id + '" type="submit">Submit</button></form></div><div class="row"><div class="col s12"><h5>Existing Comments</h5>');
			for (var i = 0; i < data.comment.length; i++) {
				$("#comments").append("<p>" + data.comment[i].user + "</p><br><p>" + data.comment[i].comment + "</p><br>");
				}//end for loop
			});

			
		});

		$(document).on("click", ".submit", function(){
			//event.preventDefault();
			var thisId = $(this).attr("data-id");
			$.ajax({
				method: "POST",
				url: "/articles/" + thisId,
				data: {
					author: $("#author").val(),
					comment: $("#comment").val()
					}
				})
			.done(function(data){
				console.log(data);
				
			})
			$("#comment").empty();
		})

		// $.each(function(i, element){
		// 	$("<p>" + title + "\n" + link + "</p>");
		// })
})