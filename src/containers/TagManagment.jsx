import React, { Component } from 'react';

import {
  Card, 
  CardText, 
  CardTitle,
  CircularProgress
} from 'react-md';

//import dataSet from './DataSet/monitorSet';
import  'react-md';
import DataTables from '../components/DataTable/DataTables';

//import DrawELock from '../components/E-Lock/DrawELock'
//import lockset from './DataSet/lockset'

import { invokeApig } from "../libs/awsLib";

var $ = require('jquery');
window.$ = window.jQuery = $;

class TagManagment extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tags:[],
      isLoading:true 
    };
  }

  async setTagData () {
    try {
      const results = await invokeApig({ path: "/tag" });
      this.setState({ tags: results ,isLoading:false});

    } catch (e) {
        alert(e);
    }
  };

  loadData = () => {
    this.setState({ isLoading: true });
  };
  /*
  componentWillMount() {
    console.log("width :"+$(window).width()+",height :"+$(window).height());
  }
  */
  componentDidMount() {
    this.setTagData();
  }
  
  componentWillUpdate(nextProps, nextState) {
    
    if (nextState.isLoading === true && this.state.isLoading === false) {
      //console.log("state update");
      this.setTagData();
    }
    
  }

  render() {
      const { tags } = this.state;
      const load = this.loadData;
      const table_fields = {
         ajax: async function ( amethod, url, data, asuccess, aerror ) {
          let meth,pat;
          try {
            switch(data.action){
              case "edit":
                meth = 'PUT';
                pat = `/tag/${Object.keys(data.data)[0]}`;
                break;
              case "remove":
                meth = 'DELETE';
                pat = `/tag/${Object.keys(data.data)[0]}`;
                break;
              default :
                meth = 'POST';
                pat = "/tag";
              break;
            }
            
            var postdata = data.data[Object.keys(data.data)[0]];
            ["error", "fieldErrors"].forEach(e => delete postdata[e]);
            
            await invokeApig({
              path: pat,
              method: meth,
              body: postdata

            });
            if(data.action!=="remove") load();
            asuccess({success:"success"});

          } catch (e) {
            aerror(e);
          }
          
        },
        idSrc:  'tagId',
        field: [ {
                label: "Name:",
                name: "tagName"
            }, {
                label: "Color:",
                name: "color"
            }, {
                label: "Size:",
                name: "size"
            }, {
                label: "Display:",
                name: "display"
            }, {
                label: "MainArea:",
                name: "mainArea"
            }, {
                label: "Status:",
                name: "tagStatus"
            }, {
                label: "Accesses:",
                name: "accesses"
            }
        ],
        columns:[
            { data: "tagName" ,title:"Name",className:"min-phone-l dt-center"},
            { data: "tagStatus" ,title:"Status",className:"dt-body-center"},
            { data: null, render: function ( data, type, row ) {
                return new Date(data.update_at).toLocaleString();
              },title:"Update_at",className:"dt-body-center"    
            },
            { data: null, render: function ( data, type, row ) {
                return new Date(data.create_at).toLocaleString();
              },title:"Create_at",className:"dt-body-center"    
            }
        ],
        pageLength: 7
      }

      return(
          <Card className="md-block-centered" >

            <CardTitle title="IndoorPosition" />
            <CardText style={{fontSize:18,background:"lightslategrey"}}>
              {
                this.state.isLoading?<CircularProgress id="tableload"/>
                :<DataTables data={tags} fields={table_fields} />
              }
            </CardText>

          </Card>
      );
  }
}

export default TagManagment;
