/**
 * Created by DG on 11/23/16.
 */
$('.dropdown-menu>li').on('click',function(){

    var apiReq = "api/" + $(this).attr('data');
    $.get( apiReq, function( data ) {

        $( "#table-display" ).html(data);

    });
});
