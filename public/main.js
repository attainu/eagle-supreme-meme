$(window).on('load',function(){
    $('.classChangeF').addClass('fb-share-button')
    $('#classChangeT').attr('class','twitter-share-button');
     
})
$(document).ready(function(){
    $('.loader').fadeOut(2500);
    // $('.heart').on('click',function(){
    //     $(this).addClass('broken');
	// 		  $(this).toggleClass('happy broken');

    //         });
    $('.showComments').on('click',function(){
        $(this).css('background','none');
    });
    $('.showComments').on('focus',function(){
        $(this).css('outline','none');
    })
    $('.flagImage').on('click',function(){
        var id = $(this).attr('alt')
        console.log(id);
        $.ajax({
            url:"/report",
            data:{
                "id": id
            },
            method : "post",
            success: function(data){
               console.log("report"+data);
               $("#reportDone").click();
                
            }
        })
    })
    $('.postwishlist').on('click',function(){
        var id = $(this).attr('id')
        console.log(id);
        $.ajax({
            url:"/wishlist",
            data:{
                "id": id
            },
            method : "post",
            success: function(data){
               console.log(data);
               if(data=="Login"){
               $("#loginModal").click()
               }
              
                
            }
        })
    })
   
    
//   var animated = false;
//   $('.heart1').click(function () {
//     if (!animated) {
//       $(this).addClass('heart-line');
//       animated = true;
//     } else {
//       $(this).removeClass('heart-line').addClass('heart1');
//       animated = false;
//     }
//   });

            
})
