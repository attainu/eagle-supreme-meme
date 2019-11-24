$(window).on('load',function(){
    
     
})
$(document).ready(function(){
    $('.loader').fadeOut(2500);
    // $('.heart').on('click',function(){
    //     $(this).addClass('broken');
	// 		  $(this).toggleClass('happy broken');

    //         });
    $('.flagImage').on('click',function(){
        var id = $(this).attr('id')
        console.log(id);
        $.ajax({
            url:"/report",
            data:{
                "id": id
            },
            method : "post",
            success: function(data){
               console.log(data);
                
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
                
            }
        })
    })
   
            
})
