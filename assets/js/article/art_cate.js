$(function() {
    // 1. 渲染文章分类列表（封装函数）
    initArtCateList();
    let layer = layui.layer;

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                // 渲染文章列表(利用模板引擎)
                let str = template('tpl-art-cate', res);
                $('tbody').empty().html(str);
            }
        });
    };

    // 添加窗口展示
    let indexAdd;
    $('#btnAdd').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });
    });

    // 添加（需要事件委托，委托给父盒子body）
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 关闭对话框
                layer.close(indexAdd);
                // 重新渲染列表
                initArtCateList();
            }
        });
    });

    // 编辑添加窗口展示
    // 不能用id
    let indexEdit;
    let form = layui.form;
    $('tbody').on('click', '.btn_edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        let Id = $(this).attr('data-id');

        $.ajax({
            url: '/my/article/cates/' + Id,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                // 渲染form表单
                form.val('form-edit', res.data);
            }
        });
    });

    // 修改（需要事件委托，委托给父盒子body）
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 关闭对话框
                layer.close(indexEdit);
                // 重新渲染列表
                initArtCateList();
            }
        });
    });

    // 删除
    $('tbody').on('click', '.btn_del', function() {
        // 获取id的时候，不要去询问里面，因为this指向改变了
        let Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status != 0) return layer.msg(res.message);
                    layer.msg(res.message);
                    // 重新渲染列表
                    initArtCateList();
                }
            });
            layer.close(index);
        });
    });
});