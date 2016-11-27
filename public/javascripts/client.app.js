/**
 * Created by DG on 11/23/16.
 */

//global body to bind future dynamic events
var body = $('body');



/**--------------------------------------------------------------------------------------------------------------------+
* GET Table record from DB
*/
$('.dropdown-menu>li').on('click',function(){
    refreshTable($(this).attr('data'));
});




/**--------------------------------------------------------------------------------------------------------------------+
* DELETE record from DB
*/
body.on('click','#delete', function () {

    var tableName = $('.table-name').attr('data-table');
    var dbname = $('#db-name').attr('data');
    var key = $('.table-name').attr('data-key');
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
        success: function(data) {
            responseMessage(data);
            //Refresh table
            refreshTable(tableName);

        }
    });
});


/**--------------------------------------------------------------------------------------------------------------------+
* UPDATE record from DB
*/
 body.on('click','#edit', function () {

    var ok = $(this);
    var tableName = $('.table-name').attr('data-table');
    var dbname = $('#db-name').attr('data');
    var key = $('.table-name').attr('data-key');
    var rowElements = ok.parent().siblings();
    var tableHead = $('#table-attr').children();
    var updateStr = getUpdateString(tableHead, rowElements);
    //get primary key of row to be deleted.
    var id = getKeyId(rowElements, tableHead,key);   


    ok.toggleClass('fa-pencil fa-check');
    rowElements.not(':last-child').attr('contenteditable',(ok.hasClass('fa-pencil'))? false : true);

    // update data to be sent on focus out
    $(rowElements).on('focusout', function () {
        $(this).attr('data', $(this).text().trim());
        
    });


    if (ok.hasClass('fa-pencil')) {

        //Ajax request for update
        var api = "api/" + dbname + "/" + tableName + "/" + id;
        $.ajax({
            url: api,
            method: "PUT",
            data: {key: key, values: updateStr},
            success: function (data) {
                responseMessage(data);
                //Refresh Table
                refreshTable(tableName);
            }
        });
    }
});


/**--------------------------------------------------------------------------------------------------------------------+
* INSERT record in DB
*/
 body.on('focusout', '.form-control', function () {

    var currantInput = $(this);
    var allInputs = currantInput.parent().parent().children('.incert-input');
    var insert = $('#insert');

    if (insertReady(allInputs)){
        insert.removeClass('disabled');

        body.on('click','#insert', function () {

            var tableName = $('.table-name').attr('data-table');
            var dbname = $('#db-name').attr('data');
            var updateStr = getInsertString(allInputs);
            //get primary key of row to be deleted.
            console.log(updateStr);



                //Ajax request for update
                var api = "api/" + dbname + "/" + tableName;
                $.ajax({
                    url: api,
                    method: "POST",
                    data: {values: updateStr},
                    success: function (data) {
                        responseMessage(data);
                        refreshTable(tableName);
                    }
                });

            });
    }
});











 




/**--------------------------------------------------------------------------------------------------------------------+
 * [getUpdateString takes 2 arrays and makes a string mapping each element by index 
 *  eg. [1,2,3,4], [a,b,c,d] = "`1`='a',`2`='b',`3`='c',`4`='d'"
 * @param  {[type]} headers [1,2,3,4]
 * @param  {[type]} td      [a,b,c,d] 
 * @return {[type]}         ["`1`='a',`2`='b',`3`='c',`4`='d'"]
 */
 function getUpdateString(headers, td) {

    var result="";
    for(var i=0; i < headers.length - 2; i++) {
        result += "`" + $(headers[i]).attr('data') +"`='" + $(td[i]).attr('data') + "', ";
    }
    result = result.substr(0, result.length - 2);
    return result;
}








/**--------------------------------------------------------------------------------------------------------------------+
 * [getInsertString takes 2 arrays and makes a string mapping each element by index 
 *  eg. [1,2,3,4], [a,b,c,d] = "`1`='a',`2`='b',`3`='c',`4`='d'"
 * @param  {[type]} headers [1,2,3,4]
 * @param  {[type]} td      [a,b,c,d] 
 * @return {[type]}         ["`1`='a',`2`='b',`3`='c',`4`='d'"]
 */
 function getInsertString(inputsList) {

    var result="";
    //"1", "Morrison", "Toni"
    for(var i=0; i < inputsList.length; i++) {
        result += "'" + $($(inputsList[i]).children()[0]).val() + "', ";
    }

    result = result.substr(0, result.length - 2);
    return result;
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
 * @param  {string} tableName       name of the table to be refreshed 
 * @return {void}                   no return
 */
 function refreshTable(tableName) {

    var apikey = "api/" + tableName;
    $.get( apikey, function( data ) {
        $( "#table-display" ).html(data);
    });

}







/**--------------------------------------------------------------------------------------------------------------------+
 * refresh a table on the front end to match DB
 * validates that all input fields are filled 
 * @param  {array of inputs} inputsList     inputs to check if they are filled
 * @return {boolean}                        this value is true if all inputs are filled otherwise is false
 */
 function insertReady(inputsList){

    var i = 0;
    var empty = false;
    while (i < inputsList.length && !empty){
        empty = ( $($(inputsList[i]).children()[0]).val() == "" )? true : false;
        i++;
    }

    return !empty;
}

/**--------------------------------------------------------------------------------------------------------------------+
 * displays the server response 
 * @param  {JSON} data contains information about the query executed 
 * @return {void}      
 */
function responseMessage(data) {
    if (data.error != null){
        $('.messages').addClass('error').html( data.error.code + "<br>" + data.query);
    }else {
        $('.messages').html('SUCCESS!!!<br>' + data.query);
    }


}