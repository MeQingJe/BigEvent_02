$(function() {
    getUserInfo();

    $('#btnLogOut').on('click', function() {
        layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
            layer.close(index);
            location.href = '/login.html';
            localStorage.removeItem('token');
        });
    });
});

function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function(res) {
            console.log(res);
            if (res.status != 0) return layui.layer.msg(res.message);
            // 成功后渲染用户（头像和名称）
            renderAvatar(res.data);
        }
    });
};

function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&emsp;' + name);
    if (user.user_pic) {
        $('.userinfo img').show.attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        let text = name[0].toUpperCase();
        $('.userinfo img').hide();
        $('.text-avatar').show().html(text);
    }
};