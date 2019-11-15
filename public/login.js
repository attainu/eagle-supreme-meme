$(document).ready(function () {

    $('#loginClick').on('click', function () {
        $('.hideLogin').hide();
        $('.inputField').css('display', 'block');
    })
    
    $('#submitClick').on('click', function() {
        if ($('#passwordSign').val() !== $('#confirmPass').val()) {
            alert("Passwords do not match.");
            return false;
        }
        return true;
    })
    

})