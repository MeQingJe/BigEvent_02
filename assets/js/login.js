$(function() {
    // 1.
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 2.校验
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,16}$/, '密码必须6到16位，且不能出现空格'
        ],
        repwd: function(value) {
            if (value != $('.reg-box input[name=password]').val())
                return '两次密码输入不一致!';
        },
    });

    // 3.注册
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/api/reguser',
            data: {
                username: $('#form_reg input[name=username]').val(),
                password: $('#form_reg input[name=password]').val(),
            },
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };
                layer.msg(res.message, { icon: 6 });
                $('#form_reg input').val('');
                $('#link_login').click();
            }
        });
    });

    // 4.登录
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/api/login',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };
                layer.msg(res.message, { icon: 6 });
                localStorage.setItem('token', res.token);
                window.location.href = '/index.html';
            }
        });
    });
});