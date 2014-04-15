if(localStorage['user']){
    $(document).ready(function(){
	$('table').dataTable({
	    "bDestroy": true,
	    fnDrawCallback: function ( oSettings ) {
		/* Need to redo the counters if filtered or sorted */
		if ( oSettings.bSorted || oSettings.bFiltered )
		    {
			for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
			    {
				$('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
				}
			}
		},
	    aoColumnDefs: [
		{ "bSortable": false, "aTargets": [ 0 ] }
		],
	    "aaSorting": [[ 1, 'asc' ]]
	    });
	})
}
else{
    console.log('no tiene')
    window.location = '../'
}
