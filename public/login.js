$(document).ready(function () {
    $('#loginClick').on('click', function () {
        $('.hideLogin').hide();
        $('.inputField').css('display', 'block');
    })
    $('#forgotPass').on('click', function () {
        $('#loginForm input[type="text"]').val('');
        $('#loginForm input[type="password"]').val('');
        $('#loginError').empty();
        $('.hideLogin').hide();
        $('.inputField').hide();
        $('.forPass').show();
    })
    $('#backToLogin').on('click', function () {
        $('#forPassForm input[type="text"]').val('');
        $('#forPassForm input[type="password"]').val('');
        $('#forPassError').empty();
        $('.hideLogin').hide();
        $('.inputField').show()
        $('.forPass').hide()
    })
    // sign-up
    $("#signUpForm").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var form = $(this);
        var url = form.attr('action');
        
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (response) {
             //   console.log(response);
                if (response === "New Account created") {
                    $('#firstname').val("");
                  //  console.log("new")
                    alert(response)
                    window.location.href = "/";
                    

                } else {
                 //   console.log("old")
                    $('#errorModalLabel').empty()
                    $('#errorModalLabel').append(response);
                    $('#loginModal').click()
                }
            }
        });
    })
    // log-in 
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var url = form.attr('action');
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (response) {
              //  console.log(response);
                if (response === "Logged-in") {
                    window.location.href = "/";
                } else {
                    $('#loginError').empty();
                    $('#loginError').append(response)
                }
            }
        })
    })
    // forget password
    $('#forPassForm').submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var url = form.attr('action');
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (response) {
                if (response === "done") {
                    $('.hideLogin').show();
                    $('.inputField').hide()
                    $('.forPass').hide()
                    $('#errorModalLabel').empty()
                    $('#errorModalLabel').append("Password has been updated");
                    $('#loginModal').click()
                    $('#forPassError').empty()
                } else {
                    $('#forPassError').empty()
                    $('#forPassError').append("Invalid input. Try again")
                }
            }
        })
    })
})