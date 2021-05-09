$(function() {

    // 获取用户的基本信息，渲染到表单中
    let form = layui.form;
    // 用户名规则校验
    form.verify({
        // 用户昵称1-6位
        nickname: function(value) {
            //判断错误的情况
            if (value.length > 6) return '昵称长度必须在 1 - 6 个字符之间！';
        }
    });
    initUserInfo();
    let layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                // console.log(res);
                if (res.status != 0)
                    return layer.msg(res.message);
                form.val('get_userinfo', res.data)
            }
        });
    };

    // 重置按钮功能
    $('#btnReset').click(function(e) {
        e.preventDefault();
        initUserInfo();
    });

    // 点击修改更新用户信息并渲染
    $('#formUserInfo').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                initUserInfo();
                //调用父页面的头像渲染方法
                window.parent.getUserInfo();
            }
        });
    });
});