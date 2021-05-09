$(function() {
    // 1.定义三个校验规则
    let form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,16}$/, '密码必须6到16位，且不能出现空格'],
        samePwd: function(value) {
            //获取原密码与value比较，不能与原密码相同
            if (value === $('[name=oldPwd]').val())
                return '新密码和原密码不能相同！';
        },
        rePwd: function(value) {
            //获取新密码与value比较，两密码要相同
            if (value !== $('[name=newPwd]').val())
                return '俩次密码输入不一致！';
        }
    });

    $('#formPwd').on('submit', function(e) {
        // 阻止默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('[name=oldPwd]').val(),
                newPwd: $('[name=newPwd]').val(),
            },
            success: function(res) {
                // console.log(res);
                if (res.status != 0)
                    return layui.layer.msg(res.message);
                layui.layer.msg(res.message);
                $('#formPwd')[0].reset();
            }
        });
    });
});