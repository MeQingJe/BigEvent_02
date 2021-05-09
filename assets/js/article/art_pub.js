$(function() {
    let layer = layui.layer;
    let form = layui.form;
    initCate();

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                let str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                form.render(); //更新表单(很重要，不写会无法显示)
            }
        });
    };

    // 2.初始化富文本编辑器
    initEditor();


    // 3.1 初始化图片裁剪器
    var $image = $('#image');

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3.3 初始化裁剪区域
    $image.cropper(options);

    // 4.选择图片
    $('#btnChooseImage').click(function() {
        $('#coverFile').click();
    });

    // 5. 渲染图片
    $('#coverFile').on('change', function(e) {
        let file = e.target.files[0];
        if (file == undefined) return;
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 6.收集状态
    let state = '';
    $('btnSave1').click(function() {
        state = '已发布';
    });
    $('btnSave2').click(function() {
        state = '草稿';
    });

    // 7. 文章发布
    $('#form_pub').submit(function(e) {
        e.preventDefault();
        // 先凑齐FormData对象参数，因为文件上传必须使用FormData对象
        let fd = new FormData(this);
        // fd中只拿到了需求中的3/5 需要添加两个状态 
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 添加最后一个属性，二进制文件
                fd.append('cover_img', blob);
                // console.log(...fd);
                //发布文章
                articlePublish(fd);
            });
    });

    //封装发布文章函数
    function articlePublish(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('发布成功！');
                // 解决bug (左侧列表不会跟着跳转，不弹出成功发布的提示)
                setTimeout(function() {
                    window.parent.document.getElementById('art_list').click();
                }, 1500);
            }
        });
    };


});