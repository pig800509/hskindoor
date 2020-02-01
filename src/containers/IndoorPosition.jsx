import React, { Component } from 'react';

import {
  Button,
  DialogContainer,
  Toolbar,
  Card, 
  CardText, 
  CardTitle,
  CircularProgress
} from 'react-md';

//import dataSet from './DataSet/monitorSet';
import  'react-md';
import DataTables from '../components/DataTable/DataTables';

import DrawELock from '../components/E-Lock/DrawELock'
import lockset from './DataSet/lockset'

import { invokeApig } from "../libs/awsLib";

var $ = require('jquery');
window.$ = window.jQuery = $;

class IndoorPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, 
                   pageX: null, 
                   pageY: null,
                   areas:[],
                   isLoading:true };
  }

  show = (e) => {
    let { pageX, pageY } = e;
    if (e.changedTouches) {
      pageX = e.changedTouches[0].pageX;
      pageY = e.changedTouches[0].pageY;
    }

    this.setState({ visible: true, pageX, pageY });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  async setAreaData () {
    try {
      const results = await invokeApig({ path: "/area" });
      this.setState({ areas: results ,isLoading:false});

    } catch (e) {
        alert(e);
    }

    const showDialog = this.show;
    $("table").on( 'click', 'button.view', function (e) {
        e.preventDefault();
        console.log("view clicked!!");
        showDialog(e);
    } );
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
    this.setAreaData();
  }
  
  componentWillUpdate(nextProps, nextState) {
    
    if (nextState.isLoading === true && this.state.isLoading === false) {
      //console.log("state update");
      this.setAreaData();
    }
    
  }

  render() {
      const { visible, pageX, pageY ,areas} = this.state;
      const load = this.loadData;
      const table_fields = {
         ajax: async function ( amethod, url, data, asuccess, aerror ) {
          let meth,pat;
          try {
            switch(data.action){
              case "edit":
                meth = 'PUT';
                pat = `/area/${Object.keys(data.data)[0]}`;
                break;
              case "remove":
                meth = 'DELETE';
                pat = `/area/${Object.keys(data.data)[0]}`;
                break;
              default :
                meth = 'POST';
                pat = "/area";
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
        idSrc:  'areaId',
        field: [ {
                label: "Name:",
                name: "areaName"
            }, {
                label: "Building:",
                name: "building"
            }, {
                label: "Floor:",
                name: "floor"
            }, {
                label: "Room:",
                name: "room"
            }, {
                label: "Wirdh:",
                name: "width"
            }, {
                label: "Height:",
                name: "height"
            }, {
                label: "Status:",
                name: "areaStatus"
            }, {
                label: "Cameras:",
                name: "cameras"
            }, {
                label: "Image:",
                name: "image"
            }, {
                label: "Zones:",
                name: "zones"
            }
        ],
        columns:[
            { data: "areaName" ,title:"Name",className:"min-phone-l dt-center"},
            { data: "building" ,title:"Building",className:"dt-body-center"},
            { data: "floor" ,title:"Floor",className:"dt-body-center"},
            { data: "room" ,title:"Room",className:"dt-body-center"},
            { data: null, render: function ( data, type, row ) {
                return new Date(data.update_at).toLocaleString();
              },title:"Update_at",className:"dt-body-center"    
            },
            { data: null, render: function ( data, type, row ) {
                return new Date(data.create_at).toLocaleString();
              },title:"Create_at",className:"dt-body-center"    
            },
            {
                data: null,
                className: "dt-center",
                title:"view",
                defaultContent: '<button class="btn view" ><i class="fa fa-eye"></i></button><button class="btn btn-red editor_remove" ><i class="fa fa-trash"></i></button>'
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
                :<DataTables data={areas} fields={table_fields} />
              }
            </CardText>

            <DialogContainer
              id="lbs-full-page-dialog"
              visible={visible}
              pageX={pageX}
              pageY={pageY}
              fullPage
              onHide={this.hide}
              aria-labelledby="lbs-full-page-dialog-title"
            >
              <Toolbar
                fixed
                colored
                title="IndoorPosition"
                titleId="lbs-full-page-dialog-title"
                nav={<Button icon onClick={this.hide}>close</Button>}
                actions={<Button flat onClick={this.hide}>cancel</Button>}
              />
              <section className="md-toolbar-relative" >
                <DrawELock setting={lockset.data} width={$(window).width()} height={$(window).height()-$("header").height()}
                  handleclose={this.hide}/>
              </section>
            </DialogContainer>
            
          </Card>
      );
  }
}

export default IndoorPosition;
