import React, { Component } from 'react';
import * as d3 from 'd3';

import { CircularProgress } from 'react-md';

class DrawELock extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      apiData:'',
      position:0
    };
  }
  
 updateTag = (result) => {
    this.setState({ apiData: result,position:this.state.position+1});
    console.log(result);
  };
 
  getAPIJson = (i) => {
    const update = this.updateTag;
    const redo = this.setTimer;
    const close = this.props.handleclose;
    d3.json('https://1b3jk85pk9.execute-api.ap-northeast-2.amazonaws.com/dev/ba6e1200-309b-11e8-b620-dd6acc8973d2', function(error, data) {
      if(i>=10) {
        alert("NetWork Error!! Please check your network or contact developer to resolve this problem. Thanks");
        close();
      }
      else if(error) {
        console.log(i);
        redo(i+1);
        return;
      }

      else {
        update(data);
        //console.log(data);
      }
   });
  }

  setTimer = (i) => {
    const redo = this.getAPIJson;
    //console.log("timerHandle :"+this.timerHandle);

    if (this.timerHandle) return;
    this.timerHandle = setTimeout(() => {
      redo(i);
      this.timerHandle = 0;
    }, 1000);
  }


  componentWillMount() {
      d3.select("#simple-full-page-dialog").style("overflow", "hidden");
  }


  async componentDidMount() {
    //var node = this.node;

    await this.getAPIJson(0);
    
  }
  
  async componentDidUpdate(prevProps, prevState) {
    const trans = this.state.apiData.tags[0];
    const pos = this.state.position; 

    console.log(pos);

    var position_x = trans.position[0];
    var position_y = trans.position[1];
    console.log(position_x);
    console.log(position_y);

    d3.selectAll("circle.tag")
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr("cx",position_x*10 + pos*5)
      .attr("cy",position_y*10 + pos*10)
      .attr("r",15)
      .attr("fill",trans.color);

    d3.select(this.node).insert("circle", "rect")
      .attr("r",0)
      .attr("cx",position_x*10 + pos*5)
      .attr("cy",position_y*10 + pos*10)
      .style("stroke-width", 5)
      .style("stroke", trans.color)
      .style("stroke-opacity", 3)
      .transition()
      .delay(800)
      .duration(400)
      .ease(d3.easeCubic)
      .attr("r", 22)
      .style("stroke-width", 2.5)
      .style("stroke-opacity", 0.8)
      .remove();
      
    await this.setTimer(0);
  }

  componentWillUnmount(){
    clearTimeout(this.timerHandle);
    d3.select(this.node).remove();
    console.log("Unmount");
  }
  
  render() {
    // const roomMap = this.props.setting;
    //  console.log(roomMap);

      const scale = this.props.height / this.props.width;
      let landspace = false;
      if(scale < 1.3207) landspace = true;

      var hlinear = d3.scaleLinear()
        .domain([0, 5071.92])
        .range([0, 3840]);

      var wlinear = d3.scaleLinear()
        .domain([0, 3840])
        .range([0, 5071.92]);

      //console.log(landspace + "lwidth :"+ wlinear(this.props.width)+"lheight :"+hlinear(this.props.height)+"height :"+window.innerWidth+"width :"+window.innerHeight);
      return (
        <div width={this.props.width} height={this.props.height} >

          { this.state.apiData.area ?<svg ref={node => this.node = node} width={"100%"} height={this.props.height} fill={"none"}>
            <image href={this.state.apiData.area.image} 
            height={landspace?"100%" : wlinear(this.props.width)} width={landspace ? hlinear(this.props.height) : "100%"}/> 
            
            <circle className="tag" cx={0} cy={0} r={10}/>
          </svg> 
          :<div>
            <br/><br/><br/><br/>
            <CircularProgress id="progress" scale={3}/>
          </div>
          }
        </div>
      );
  }
}
export default DrawELock;
