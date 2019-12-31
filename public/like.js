$(document).ready(function () {

    var data
    $('.heart1').on('click', function () {

        if ($(this).attr("class") === "heart1") {
            data = {
                "postId": $(this).attr('id'),
                "like": true,
                "time": (new Date()).getTime()
            }
        } else {
            data = {
                "postId": $(this).attr('id'),
                "like": false,
                "time": (new Date()).getTime()
            }
        }
        console.log(data);

        $.ajax({
            url: "/like",
            method: "post",
            data: data,
            success: function (response) {
                console.log(response);
                if (response === "done") {
                    $.ajax({
                        url: "/likeCount",
                        method: "post",
                        data: data,
                        success: function (res) {
                            console.log(res, data.postId)
                            $("#likeCount" + data.postId).empty();
                            $("#likeCountC" + data.postId).empty()
                            $("#likeCount" + data.postId).append(res + " Likes");
                            $("#likeCountC" + data.postId).append(res + " Likes");
                            $('#' + data.postId).toggleClass('heart-line', 'broken');
                            $('div.likebutton' + data.postId+ " > div").toggleClass('heart-line', 'broken');
                            $('div.likebuttonMess' + data.postId+ " > div").toggleClass('heart-line', 'broken');
                        }
                    })
                }
                if (response === "First login") {
                    console.log('working');
                    $("#loginModal").click()
                };
            },
            error: function (error) {
                console.log(error);
            }
        })
    });


// comments     
    var id 
    $('.showComments').on('click', function(){
        console.log($(this).attr('name'))
        id = $(this).attr('name');
        var dataShowComment = {
            "postId": $(this).attr('name')
        }
        $('#commentList'+ id).empty()
        $.ajax({
            url: "/getComments",
            method: "post",
            data: dataShowComment,
            success: function(response){
                console.log(response);
                for (let i = 0; i < response.length; i++) {
                    console.log(response[i].accountName, response[i].comment, id);
                    $('#commentList'+ id).append("<h4 class='d-inline'><b>" + response[i].accountName + ": </b></h4><h5 class='d-inline'>" + response[i].comment + "</h5><br><br>") 
                }
            }
        })
    })
    
    $('.saveComment').on('click', function(){
        console.log($(this).attr('name'))
        id = $(this).attr('name')
        if ($('#saveComment'+ $(this).attr('name')).val().length !== 0){
            $("#commentError"+ $(this).attr('name')).hide()
        var dataComment = {
            "postId": $(this).attr('name'),
            "comment": $('#saveComment'+ $(this).attr('name')).val()
        }

        $.ajax({
            url: "/saveComment",
            method: "post",
            data: dataComment,
            success: function(response){
                console.log(response);
                if (response === "First login") {
                    console.log('working');
                    $("#loginModal").click()
                } else {
                    $('#saveComment'+ id).val('');
                    $('#commentList'+ id).append("<h4 class='d-inline'><b>" + response[0] + ": </b></h4><h5 class='d-inline'>" + response[1] + "</h5><br><br>")
                }
            }
        })
    } else {
        $("#commentError"+ $(this).attr('name')).show()
    }
    })
    
})

