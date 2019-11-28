$(document).ready(function () {


    $(window).on('load', function () {
        $('.classChangeF').addClass('fb-share-button')
        $('#classChangeT').attr('class', 'twitter-share-button');

    })
    $(document).ready(function () {
        $('.loader').fadeOut(2500);
        // $('.heart').on('click',function(){
        //     $(this).addClass('broken');
        // 		  $(this).toggleClass('happy broken');

        //         });
        $('.showComments').on('click', function () {
            $(this).css('background', 'none');
        });
        $('.showComments').on('focus', function () {
            $(this).css('outline', 'none');
        })
        $('.flagImage').on('click', function () {
            var id = $(this).attr('alt')
            console.log(id);
            $.ajax({
                url: "/report",
                data: {
                    "id": id
                },
                method: "post",
                success: function (data) {
                    console.log("report" + data);
                    $("#reportDone").click();

                }
            })
        })
        $('.postwishlist').on('click', function () {
            var id = $(this).attr('id')
            console.log(id);
            $.ajax({
                url: "/wishlist",
                data: {
                    "id": id
                },
                method: "post",
                success: function (data) {
                    console.log(data);
                    if (data == "Login") {
                        $("#loginModal").click()
                    }


                }
            })
        })
        $('.hamburger').on('click',function(){
            console.log("Clicked");
            $('.change').toggleClass('changeTO');
            $('.line').toggleClass('lineChange');
        });


        var log;
        $('#uploadModalBtn').on('click', async function () {

            $.ajax({
                url: "/checkLogin",
                method: "post",
                data: "check login",
                success: function (response) {
                    console.log(response)
                    log = response
                    
                    $("#btnUpForm").click(function (event) {

                        event.preventDefault();
                        var form = $('#uploadForm')[0];
                        var data = new FormData(form);

                        $("#btnUpForm").prop("disabled", true);
                        if (response === ('loggedIn')){
                            console.log(response)
                        $.ajax({
                            type: "POST",
                            enctype: 'multipart/form-data',
                            url: "/upload",
                            data: data,
                            processData: false,
                            contentType: false,
                            cache: false,
                            timeout: 600000,
                            success: function (data) {
                                if(data === "done"){
                                    $("#BtnClose").click();
                                    alert('Post Uploaded')
                                }
                            },
                            error: function (e) {
                                console.log("ERROR : ", e);

                            }
                        });
                    } else {
                        console.log("hello"+response)
                        $("#BtnClose").click();
                        $('#loginModal').click();
                    }
                    });
                
                }
            })
        })
    })

    // $("#uploadForm").submit(function(e) {
    //     e.preventDefault();
    //     var formData = new FormData(this);    

    //     $.post($(this).attr("action"), formData, function(data) {
    //         alert(data);
    //     });
    // });

    // $("#btnUpForm").click(function (event) {


    //     event.preventDefault();
    //     var form = $('#uploadForm')[0];
    //     var data = new FormData(form);

    //     $("#btnUpForm").prop("disabled", true);

    //     $.ajax({
    //         type: "POST",
    //         enctype: 'multipart/form-data',
    //         url: "/upload",
    //         data: data,
    //         processData: false,
    //         contentType: false,
    //         cache: false,
    //         timeout: 600000,
    //         success: function (data) {
    //             console.log(data);
    //         },
    //         error: function (e) {
    //             console.log("ERROR : ", e);

    //         }
    //     });

    // });


    //     $.ajax({
    //         type: "POST",
    //         url: window.location.pathname,
    //         data: formData, // serializes the form's elements.
    //         success: function (response) {
    //             console.log(response)
    //         }
    //     });

    // })
});