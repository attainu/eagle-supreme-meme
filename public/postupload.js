$(document).ready(function () {

    $('#upload').on('click', function () {
        window.location.href='/upload';
        $.ajax({

            // 'url' : 'http://voicebunny.comeze.com/index.php',
            'type' : 'post',
            'data' : {
            },
            'success' : function(data) {     
                console.log('hi');         
                alert('Data: '+data);
            },
            'error' : function(request,error)
            {
                alert("Request: "+JSON.stringify(request));
            }
        });
    })

})