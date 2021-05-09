$(function() {
    // 0.传入日期函数，使用过滤器完成
    template.defaults.imports.dateFormat = function(dt) {
        let dtObj = new Date(dt);
        let y = dtObj.getFullYear();
        let m = padZero(dtObj.getMonth() + 1);
        let d = padZero(dtObj.getDate());
        let HH = padZero(dtObj.getHours());
        let MM = padZero(dtObj.getMinutes());
        let SS = padZero(dtObj.getSeconds());
        return `${y}-${m}-${d} ${HH}:${MM}:${SS}`;
    };

    function padZero(n) {
        return n < 10 ? '0' + n : n;
    };
    // 1.定义查询参数（过滤和分页都要用）
    let layer = layui.layer;
    let form = layui.form;
    let q = {
        pagenum: 1, //是 int 页码值
        pagesize: 2, //是 int 每页显示多少条数据
        cate_id: '', //否 string 文章分类的 Id
        state: '', //否 string 文章的状态， 可选值有： 已发布、 草稿
    };

    // 2.渲染文章列表页面
    initTable();
    // 封装渲染文章列表函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                let str = template('tpl-table', { data: res.data });
                $('tbody').html(str);
                // 做分页;
                renderPage(res.total);
            }
        });
    };

    // 3.初始化文章分类
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

    // 4.筛选
    $('#form-search').submit(function(e) {
        // 阻止默认提交
        e.preventDefault();
        // 修改参数
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 调用渲染文章列表方法
        initTable();
    });

    // 5.分页
    function renderPage(total) {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'pageBox', //注意，这里的pageBox是ID，不用加#号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 20],
            curr: q.pagenum,
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                };
            }
        });
    };

    // 6. 删除
    $('tbody').on('click', '.btn-delete', function() {
        let Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', function(index) {
            $.ajax({
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status != 0) return layer.msg(res.message);
                    // bug:删除最后一条元素，当前页减一(当前页的页码必须大于一)
                    // 在重新渲染页面之前，被删除的元素，页面中依然存在这条数据
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                    layer.msg('删除成功！');
                }
            });
            layer.close(index);
        });
    });
});