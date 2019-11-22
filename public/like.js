$(document).ready(function () {

    var data
    $('.heart').on('click', function () {

        if ($(this).attr("class") === "heart" || $(this).attr("class") === "heart broken") {
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
                            $("#likeCount" + data.postId).append("Likes " + res);
                            $("#likeCountC" + data.postId).append("Likes " + res);
                            $('#' + data.postId).toggleClass('happy', 'broken');
                            $('div.likebutton' + data.postId+ " > div").toggleClass('happy', 'broken');
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

})