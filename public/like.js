$(document).ready(function () {

    var data
    $('.heart').on('click', function () {

        if ($(this).attr("class") === "heart" || $(this).attr("class") === "heart broken") {
            data = {
                "postId" : $(this).attr('id'),
                "like" : true
            }
            $(this).addClass('happy').removeClass('broken');
        } else {
            data = {
                "postId" : $(this).attr('id'),
                "like" : false
            }
            $(this).removeClass('happy').addClass('broken');
        }
        
        $.ajax({
            url: "/like",
            method: "post",
            data: data,
            success: function (data) {
                console.log(data.status);
                
            },
            error: function (error) {
                console.log(error);
    
            }
        })
    
    });


    
})