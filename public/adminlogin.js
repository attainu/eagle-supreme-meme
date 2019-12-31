$('#loginbutton').on('click',function(){
    var username = $('#username').val();
    var password = $('#password').val();
    var data = {
        "username":username,
        "password":password
    }

    $.ajax({
        url:"/auth",
        method:"post",
        data:data,
        success:function(data){
            console.log(data);
            if(data.status=="200"){
                window.location.href = "/dashboard";
            }
            
        },
        error:function(error){
            console.log(error);

        }
    })
})