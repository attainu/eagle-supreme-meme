$(document).ready(function () {

    var data
    $('.heart').on('click', function () {

        if ($(this).attr("class") === "heart" || $(this).attr("class") === "heart broken") {
            data = {
                "postId" : $(this).attr('id'),
                "like" : true,
                "time" : (new Date()).getTime()
            }
            $("#likeCount" + data.postId).empty();
            $(this).addClass('happy').removeClass('broken');
        } else {
            data = {
                "postId" : $(this).attr('id'),
                "like" : false,
                "time" : (new Date()).getTime()
            }
            $("#likeCount" + data.postId).empty();
            $(this).removeClass('happy').addClass('broken');
        }
        console.log(data);

        $.ajax({
            url: "/like",
            method: "post",
            data: data,
            success: function (response) {
                console.log(response);
                if (response === "done"){
                    console.log(response);
                    $.ajax({
                        url: "/likeCount",
                        method: "post",
                        data: data,
                        success: function (res){
                            console.log(res, data.postId)
                            $("#likeCount"+data.postId).append("Likes "+ res);
                        }
                    })
                }
               if(response === "First login"){
                   console.log('working');
                   $("#loginModal").click()
               };
                
            },
            error: function (error) {
                console.log(error);
    
            }
        })
    
    });
    
})