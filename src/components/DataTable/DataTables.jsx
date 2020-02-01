import React,{ PureComponent } from 'react';
import './css/datatables.css'

var $ = require('jquery');
window.$ = window.jQuery = $;

$.DataTable = require( 'datatables.net' );

require( 'datatables.net-editor' );
require( 'datatables.net-buttons' );
require( 'datatables.net-select' );
require( 'datatables.net-fixedcolumns' );

class DataTables extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
        data:this.props.data
    }
  }
  /*
  componentWillMount() {
  }
  */
  componentDidMount() {

    this.$el = $(this.el);

    var editor = new $.fn.dataTable.Editor( {
        table: this.$el,
        fields: this.props.fields.field,
        idSrc: this.props.fields.idSrc,
        ajax: this.props.fields.ajax
    } );
    
    //console.log(this.$el);
    this.$el.DataTable( {
        dom: "Bfrtip",
        data: this.state.data,
        columns: this.props.fields.columns,
        select: {
            style: 'single'
        },
        buttons: [
            { extend: 'create', editor: editor },
            { extend: 'edit', editor: editor }
//            ,{ extend: 'remove', editor: editor }
        ],
        columnDefs: [
            { width: '7%', targets: 0 }
        ],
        fixedColumns: true,
        "ordering": false,
        "pageLength": this.props.fields.pageLength,
        responsive: true
    } );

    this.$el.on('click', 'button.editor_remove', function (e) {
        e.preventDefault();
      
    editor.remove( $(this).closest('tr'), {
            title: 'Delete',
            message: 'Are you sure to remove this column?',
            buttons: 'Yes'
        } );
    } );

  }
/*  
  componentDidUpdate(prevProps, prevState) {
  }
 */ 
  componentWillUnmount(){
    this.$el.DataTable({"destroy":true});
  }
  
  render() {
      return(
        <div>
        <table ref={el => this.el = el} className="display compact cell-border" cellSpacing="0" width="100%" >
        </table>
        </div>
      );
  }
  
  
}

export default DataTables;
