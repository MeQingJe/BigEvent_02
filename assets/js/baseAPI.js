let baseUrl = 'http://api-breakingnews-web.itheima.net';

$.ajaxPrefilter(function(params) {
    params.url = baseUrl + params.url;

    if (params.url.indexOf('/my/') >= 0) {
        // 或者 != -1
        // headers前面是点后面是等号
        params.headers = {
            Authorization: localStorage.getItem('token') || '',
        };
    }; //以/api开头的什么都不需要更改
});