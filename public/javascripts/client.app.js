/**
 * Created by DG on 11/23/16.
 */

/*
*Tables request
* */
$('.dropdown-menu>li').on('click',function(){

    var apikey = "api/" + $(this).attr('data');
    $.get( apikey, function( data ) {

        $( "#table-display" ).html(data);

    });
});

/*
 *Delete record from DB
 * */
 $('body').on('click','#delete', function () {

    var tableName = $('.panel-heading').attr('data-table');
    var dbname = $('#db-name').attr('data');
    var key = $('.panel-heading').attr('data-key');
    var row = $(this).parent().siblings();
    var tableHead = $('#table-attr').children();

    //get primary key of row to be deleted.
    var id = getKeyId(row,tableHead,key);


    //Ajax delete tuple with api call
    var api = "api/" + dbname + "/" + tableName + "/" + id;
    $.ajax({
        url: api,
        type: 'DELETE',
        data:{key: key},
        success: function() {
            //Refresh table
            refreshTable(tableName);

        }
    });
});


/*
 *Update record from DB
 * */

$('body').on('click','#edit', function () {

    var ok = $(this);
    var tableName = $('.panel-heading').attr('data-table');
    var dbname = $('#db-name').attr('data');
    var key = $('.panel-heading').attr('data-key');
    var rowElements = ok.parent().siblings();
    var tableHead = $('#table-attr').children();
    var updateStr = getObjectHeaderString(tableHead, rowElements);
    //get primary key of row to be deleted.
    var id = getKeyId(rowElements, tableHead,key);

    console.log(updateStr);


    ok.toggleClass('fa-pencil fa-check');

    rowElements.not(':last-child').attr('contenteditable',(ok.hasClass('fa-pencil'))? false : true);

    // update data to be sent on focus out
    $(rowElements).on('focusout', function () {
        $(this).attr('data', $(this).text().trim());
        console.log($(rowElements));
    });


    if (ok.hasClass('fa-pencil')) {

        //Ajax request for update
        var api = "api/" + dbname + "/" + tableName + "/" + id;
        $.ajax({
            url: api,
            method: "PUT",
            data: {key: key, values: updateStr},
            success: function () {
                refreshTable(tableName);
            }
        });
    }




});
 




/**--------------------------------------------------------------------------------------------------------------------+
 * [getObjectHeaderString takes 2 arrays and makes a string mapping each element by index 
 *  eg. [1,2,3,4], [a,b,c,d] = "`1`='a',`2`='b',`3`='c',`4`='d'"
 * @param  {[type]} headers [1,2,3,4]
 * @param  {[type]} td      [a,b,c,d] 
 * @return {[type]}         ["`1`='a',`2`='b',`3`='c',`4`='d'"]
 */
function getObjectHeaderString(headers, td, key) {

    var result="";
    console.log(headers);
    //`authorNum`="1", `authorLast`="Morrison", `authorFirst`="Toni"
    for(var i=0; i < headers.length - 2; i++) {
        result += "`" + $(headers[i]).attr('data') +"`='" + $(td[i]).attr('data') + "', ";
    }

    return result.substr(0, result.length - 2);
}

/**--------------------------------------------------------------------------------------------------------------------+
 * Gets the value of the primary key of the selected tuple
 * @param  {array of elements} row         elements to get the id for query 
 * @param  {array of strings}  tableHead   column names
 * @param  {string}            key         found primary key value
 * @return {string}                        primary key value
 */
function getKeyId (row,tableHead,key) {
    var i = 0;
    while (i < tableHead.length && key != $(tableHead[i]).attr('data')){
        i++;
    }
    return $(row[i]).attr('data');
}

/**--------------------------------------------------------------------------------------------------------------------+
 * refresh a table on the front end to match DB
 * @param  {string} tableName name of the table to be refreshed 
 * @return {void}           no return
 */
function refreshTable(tableName) {

    var apikey = "api/" + tableName;
    $.get( apikey, function( data ) {
        $( "#table-display" ).html(data);
    });

}
