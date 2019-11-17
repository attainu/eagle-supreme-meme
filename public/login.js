$(document).ready(function () {

    $('#loginClick').on('click', function () {
        $('.hideLogin').hide();
        $('.inputField').css('display', 'block');
    })

    $('#forgotPass').on('click', function(){
        $('.hideLogin').hide();
        $('.inputField').hide()
        $('.forPass').show()
    })

    console.log($('#seqPassword')[0].innerText);

    if ($('#seqPassword')[0].innerText !== "") {
        $('.hideLogin').hide()
        $('.inputField').hide()
        $('.forPass').show()
    }
    
    $('#submitClick').on('click', function() {
        if ($('#passwordSign').val() !== $('#confirmPass').val()) {
            alert("Passwords do not match.");
            return false;
        }
        return true;
    })
    

})