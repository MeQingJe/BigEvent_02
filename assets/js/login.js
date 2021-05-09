$(function() {
    //底层走的是 DOMContentLoaded 事件
    // 需求1: 点击a链接，显示隐藏指定区域
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    //需求2: 自定义校验规则
    // 导出form属性，方便后面使用
    let form = layui.form;
    // 通过form中的verify()定义校验规则
    // 参数是一个对象
    form.verify({
        // 属性是校验规则名称，值就是校验的规则（值是数组）
        pwd: [/^[\S]{6,16}$/, '密码必须6到16位，且不能出现空格'],
        repwd: function(value) {
            //value获取的是确认密码的值
            if ($('.reg-box input[name=password]').val() != value) {
                return '两次密码输入不一致!';
            };
        },
    });

    // 需求3: 注册
    let layer = layui.layer;
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg input[name=username]').val(),
                password: $('#form_reg input[name=password]').val(),
            },
            success: function(res) {
                //状态校验
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };
                layer.msg(res.message, { icon: 6 });
                $('#form_reg')[0].reset();
                $('#link_login').click();
            }
        });
    });

    // 需求4: 登录
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                };
                // 成功后保存token， 页面跳转， 弹窗
                layer.msg(res.message, { icon: 6 });
                localStorage.setItem('token', res.token);
                window.location.href = '/index.html'; //页面跳转
            }
        });
    });
});