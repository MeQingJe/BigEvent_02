let baseUrl = 'http://api-breakingnews-web.itheima.net';

$.ajaxPrefilter(function(parmas) {
    parmas.url = baseUrl + parmas.url;
});