$(document).ready(function () {

    $('#loginClick').on('click', function () {
        $('.hideLogin').hide();
        $('.inputField').css('display', 'block');
    })

    $('#forgotPass').on('click', function () {
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

    $('#submitClick').on('click', function () {
        if ($('#passwordSign').val() !== $('#confirmPasswordSign').val()) {
            $('#errorModalLabel').empty()
            $('#errorModalLabel').append("Password doesn't match");
            $('#passwordSign').val('')
            $('#confirmPasswordSign').val('')
            $('#loginModal').click()
            return false;
        }
        return true;
    })

    $("#signUpForm").submit(function (e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this);
        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (response) {
                console.log(response);
                if (response === "New Account created") {
                    alert(response)
                    window.location.href = "/";
                } else {
                    $('#errorModalLabel').empty()
                    $('#errorModalLabel').append(response);
                    $('#loginModal').click()
                }
            }
        });
    })
})