function alignResize(){var i={}
$(".height-align").css("height","auto"),$(".height-align").each(function(){var a=$(this).data("align-group"),e=$(this).height()
i.hasOwnProperty(a)?i.pack<e&&(i.pack=e):i[a]=e}),$(".height-align").each(function(){var a=$(this).data("align-group")
$(this).height(i[a])})}$(document).ready(function(){alignResize(),$(window).resize(alignResize)})
