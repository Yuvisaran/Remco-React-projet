/* Multi select */


/* Upload File */
$(document).on('click', '.browse', function () {
    var file = $(this).parent().parent().parent().find('.file');
    file.trigger('click');
});
$(document).on('change', '.file', function () {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
});


/* ToolTip */
$(document).ready(function () {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});

/* Date TimePicker */
$(function () {
    $("#datepicker, #datepicker1").datepicker();
});