(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{22:function(e,t,a){},23:function(e,t,a){},27:function(e,t,a){e.exports=a(79)},33:function(e,t,a){},36:function(e,t,a){},38:function(e,t,a){},41:function(e,t,a){},44:function(e,t,a){},65:function(e,t,a){},67:function(e,t,a){},69:function(e,t,a){},71:function(e,t,a){},73:function(e,t,a){},75:function(e,t,a){},77:function(e,t,a){},79:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(25),o=a.n(r),s=(a(33),a(7)),c=a(4),l=a(6),u=a(9),d=a(8),h=a(5),f=a(10),g=a(3),m=a(12),p=a.n(m),v=a(11),y=a.n(v);a(36);function w(e){var t=e.children,a=e.handleClick,n=e.isSelected,r=e.mixClasses,o=(e.size,e.type),s=y()("toggleButton",{BASIC:"toggleButtonBasic",TAG:"toggleButtonTag",TEXT:"toggleButtonText"}[o],{"-selected":n},r);return i.a.createElement("button",{className:s,type:"button",onClick:a},t)}a(38);var b=function(e){var t=e.lang,a=e.filename,n=e.register,r=e.toggleRegisterFilter;return i.a.createElement("li",{className:"registerItem"},i.a.createElement("input",{id:n.name.en,type:"checkbox",onChange:function(){return r(a,n.name.en)},checked:n.isSelected}),i.a.createElement("label",{htmlFor:n.name.en},n.name[t]))};a(22),a(41);function x(e){var t=e.fileFilter,a=e.filename,n=e.lang,r=e.toggleFileFilter,o=e.toggleRegisterFilter,s=t.registers,c=Object.keys(s).map(function(e){return i.a.createElement(b,{lang:n,key:"".concat(t.name[n],"/").concat(e),filename:a,toggleRegisterFilter:o,register:s[e]})}),l=y()("simpleList","registerList__simpleList",{vanish:!t.isSelected});return i.a.createElement("li",{className:"simpleList__listItem"},i.a.createElement(w,{isSelected:t.isSelected,mixClasses:"simpleList__button",handleClick:function(){return r(a)},type:"BASIC"},t.name[n]),i.a.createElement("ul",{className:l},c))}a(23),a(44);var k=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).toggleMinimize=a.toggleMinimize.bind(Object(g.a)(Object(g.a)(a))),a.cohortTitle={en:"Filter by cohorts:",fi:"Suodata kohortteja:"},a.keywordTitle={en:"Select a keyword...",fi:"Valitse avainsana..."},a.registrarTitle={en:"...or select a registrar:",fi:"...tai valitse yll\xe4pit\xe4j\xe4:"},a.state={isMinimized:!1},a}return Object(f.a)(t,e),Object(h.a)(t,[{key:"toggleMinimize",value:function(){this.setState(function(e){return{isMinimized:!e.isMinimized}})}},{key:"render",value:function(){var e=this.props,t=e.cohortFilter,a=e.keywordFilter,n=e.treeFilter,r=e.toggleCohortFilter,o=e.toggleFileFilter,s=e.toggleKeywordFilter,c=e.toggleRegisterFilter,l=e.selectLang,u=e.lang,d=this.state.isMinimized,h=y()("card","card--strongShadow","sidePanel",{"sidePanel--closed":d}),f=y()("sidePanel__toggleControl",{"sidePanel__toggleControl--rotate":d}),g=["en","fi"].map(function(e){return i.a.createElement(w,{key:e,isSelected:u===e,type:"TEXT",handleClick:function(){return l(e)}},e)}),m=Object.values(t).map(function(e){return i.a.createElement(w,{key:e.name,isSelected:e.isSelected,type:"TAG",handleClick:function(){return r(e.name)},mixClasses:"sidePanel__langSelector"},e.name)}),p=a[u],v=[];p&&(v=Object.keys(p).sort().map(function(e){var t=p[e].isSelected;return i.a.createElement(w,{key:e,isSelected:t,type:"TAG",handleClick:function(){return s(e)},mixClasses:"sidePanel__keywordSelector"},e)}));var b=Object.keys(n).map(function(e){var t=n[e];return i.a.createElement(x,{lang:u,key:e,filename:e,fileFilter:t,toggleFileFilter:o,toggleRegisterFilter:c})});return i.a.createElement("aside",{className:h},i.a.createElement("div",{className:"sidePanel__controls"},i.a.createElement("div",{className:"sidePanel__controlsRow"},i.a.createElement("div",{className:"sidePanel__langControls"},g),i.a.createElement("button",{type:"button",className:f,onClick:this.toggleMinimize},i.a.createElement("img",{src:"assets/material-arrow_back.svg",alt:"register panel toggle"}))),i.a.createElement("div",{className:""},i.a.createElement("h2",{className:"sidePanel__categoryTitle"},this.cohortTitle[u]),i.a.createElement("div",null,m)),i.a.createElement("div",{className:"sidePanel__controlsRow"}),i.a.createElement("div",{className:""},i.a.createElement("h2",{className:"sidePanel__categoryTitle"},this.keywordTitle[u]),i.a.createElement("div",null,v),i.a.createElement("h2",{className:"sidePanel__categoryTitle sidePanel__categoryTitle--secondary"},this.registrarTitle[u]))),i.a.createElement("ul",{className:"simpleList sidePanel__simpleList"},b))}}]),t}(n.Component),S=a(26),F=a.n(S);a(63),a(65);var D=function(e){var t=e.handleYearSelection,a=e.selectedYears,n=(new Date).getFullYear();return i.a.createElement("div",{className:"yearControl"},i.a.createElement(F.a,{className:"yearControl__slider",minValue:1900,maxValue:n,value:a,onChange:function(e){return t(e,"change")},onChangeComplete:function(e){return t(e,"afterChange")}}))};var j=function(e){var t=e.lang,a=e.name,n=e.handleYearSelection,r=e.selectedYears;return i.a.createElement("div",{className:"card__header"},i.a.createElement("h2",{className:"title card__title"},a[t]),i.a.createElement("div",{className:"card__yearControl"},i.a.createElement("h3",{className:"year-control-title"},"Set years:"),i.a.createElement(D,{handleYearSelection:n,selectedYears:r})))};a(67);function O(e){var t=e.children,a=e.layoutStyles;return i.a.createElement("div",{style:a,className:"infoBox"},t)}var E=a(17),C=a(18),_=a(16),P=a(2),N=a(19),Y=a(1),T={select:E.a,selectAll:E.b,tree:C.b,hierarchy:C.a,scaleTime:_.b,scaleBand:_.a,min:P.e,max:P.d,axisTop:N.b,axisBottom:N.a,timeYear:Y.k},L=(a(69),function(){function e(t,a,n){var i=this;Object(l.a)(this,e),this.config={width:n.width?n.width:400,height:n.height?n.height:200,posX:n.posX?n.posX:0,posY:n.posY?n.posY:0,childrenNames:n.childrenNames?n.childrenNames:["registerAdmins","registers","categories","samplings"],nodeSize:n.nodeSize?n.nodeSize:10,animationDuration:n.animationDuration?n.animationDuration:750,lang:n.lang?n.lang:"en"};var r=this.config.height,o=this.config.width,s=T.tree().size([r,o]).separation(function(){return 1}),c=T.hierarchy(t,function(e){return i.findChildArr(e)});this.treeData=s(c),this.svg=a.append("g").attr("class","tree").attr("width",this.config.width).attr("height",this.config.height).attr("transform","translate(".concat(this.config.posX,", ").concat(this.config.posY,")")).append("g"),this.sourceCoord={x:r/2,y:0},this.idCounter=0}return Object(h.a)(e,[{key:"findChildArr",value:function(e){var t=this.config.childrenNames.filter(function(t){return void 0!==e[t]})[0];return void 0!==t?e[t]:null}},{key:"drawNodeCircles",value:function(e){e.append("circle").attr("class","tree__node-marker").attr("r",this.config.nodeSize)}},{key:"moveNodesInPlace",value:function(e){e.attr("transform",function(e){return"translate(".concat(e.y,", ").concat(e.x,")")})}},{key:"addNodeLabels",value:function(e){var t=this;e.filter(function(e){return e.parent}).append("a").append("text").attr("class","tree__node-label").attr("dy",function(e){return t.constructor.calculateLabelPlacement(e)}).attr("dx",-15).attr("text-anchor","middle").text(function(e){return e.data.isHarmonized?e.data.name[t.config.lang]+" (*)":e.data.name[t.config.lang]}).call(this.constructor.wrapText,175),e.selectAll("a").filter(function(e){if(""!==(e.data.link?e.data.link[t.config.lang]:""))return!0}).attr("href",function(e){return e.data.link[t.config.lang]}).attr("rel","noopener noreferrer").attr("target","_blank").attr("class","tree__url-link"),e.filter(function(e){return!e.parent}).append("a").append("text").attr("class","tree__node-label").attr("dy",0).attr("dx",-35).attr("text-anchor","middle").text(function(e){return e.data.isHarmonized?e.data.name[t.config.lang]+" (*)":e.data.name[t.config.lang]}).call(this.constructor.wrapText,50)}},{key:"updateNodes",value:function(){var e=this,t=this.treeData.descendants(),a=this.svg.selectAll(".node").data(t,function(t){var a=t.id?t.id:e.idCounter;return t.id=a,e.idCounter+=1,a}),n=a.enter().append("g").attr("class","tree__node").attr("transform",function(){return"translate(".concat(e.sourceCoord.y,", ").concat(e.sourceCoord.x,")")});this.moveNodesInPlace(n),this.addNodeLabels(n),a.exit().attr("transform","translate(".concat(this.sourceCoord.y,", ").concat(this.sourceCoord.x,")")).remove()}},{key:"updateLinks",value:function(){var e=this,t=this.treeData.descendants().slice(1),a=this.svg.selectAll("path.link").data(t,function(t){var a=t.id?t.id:e.idCounter;return t.id=a,e.idCounter+=1,a});a.enter().insert("path","g").attr("class","tree__link").attr("d",function(){var t={x:e.sourceCoord.x,y:e.sourceCoord.y};return e.constructor.diagonal(t,t)}).attr("d",function(t){return e.constructor.diagonal(t,t.parent)}),a.exit().attr("d",function(){var t={y:e.sourceCoord.y,x:e.sourceCoord.x};return e.constructor.diagonal(t,t)}).remove()}}],[{key:"diagonal",value:function(e,t){return"M ".concat(e.y," ").concat(e.x,"\n                  C ").concat((e.y+t.y)/2," ").concat(e.x,",\n                    ").concat((e.y+t.y)/2," ").concat(t.x,",\n                    ").concat(t.y," ").concat(t.x)}},{key:"wrapText",value:function(e,t){e.each(function(){for(var e,a=T.select(this),n=a.text().split(/\s+/).reverse(),i=[],r=a.attr("y"),o=parseFloat(a.attr("dy")),s=parseFloat(a.attr("dx")),c=a.text(null).append("tspan").attr("x",0).attr("y",r).attr("dy","".concat(o,"em"));e=n.pop();)i.push(e),c.text(i.join(" ")),c.node().getComputedTextLength()>t&&(i.pop(),c.text(i.join(" ")),i=[e],c=a.append("tspan").attr("x",0).attr("y",r).attr("dy","1.25em").attr("dx",s).text(e))})}},{key:"calculateLabelPlacement",value:function(e){try{Math.ceil(e.x)>Math.ceil(e.parent.x)?e.labelPosition="under":Math.ceil(e.x)<Math.ceil(e.parent.x)?e.labelPosition="top":e.labelPosition=e.parent.labelPosition?e.parent.labelPosition:"top"}finally{switch(e.labelPosition){case"top":return"-1.75em";case"under":return"1.25em";default:return"0em"}}}}]),e}()),A=a(20),B=(a(71),function(){function e(t,a,n){Object(l.a)(this,e),this.config={width:n.width?n.width:400,height:n.height?n.height:200,posX:n.posX?n.posX:0,posY:n.posY?n.posY:0,scaleStartDate:n.scaleStartDate?n.scaleStartDate:new Date("1987-01-01"),scaleEndDate:n.scaleEndDate?n.scaleEndDate:new Date,xAxisOrientation:n.xAxisOrientation?n.xAxisOrientation:"bottom",showXAxis:null==n.showXAxis||n.showXAxis,showLegend:null==n.showLegend||n.showLegend,categories:n.categories?n.categories:[{en:"parents",fi:"vanhemmat"},{en:"subjects",fi:"kohorttilaiset"}],cohorts:n.cohorts?n.cohorts:["1987","1997"],lang:n.lang?n.lang:"en"},this.data=this.constructor.prepareData(t,this.config),this.xAxisPadding=30,this.svg=a.append("g").attr("class","timeline-chart").attr("width",this.config.width).attr("height",this.config.height+this.xAxisPadding).attr("transform","translate(".concat(this.config.posX,", ").concat(this.config.posY,")")),this.x=T.scaleTime().domain([this.config.scaleStartDate,this.config.scaleEndDate]).range([0,this.config.width-100]),this.y=T.scaleBand().domain(this.config.categories.map(function(e){return e.en})).range([this.xAxisPadding,this.config.height]).paddingInner(.1).round(!0),this.cohortNum=this.config.cohorts.length,this.cohortHeight=this.y.bandwidth()/this.cohortNum}return Object(h.a)(e,[{key:"drawXAxis",value:function(){var e,t=this;(e="top"===this.config.xAxisOrientation?T.axisTop(this.x):T.axisBottom(this.x)).ticks(T.timeYear.every(10)),this.svg.append("g").attr("class","timeline__axis").call(e).attr("transform",function(){return"top"===t.config.xAxisOrientation?"translate(0, -2.5)":"translate(0, ".concat(t.config.height-t.xAxisPadding+2.5,")")})}},{key:"drawLegend",value:function(){var e=this,t=this.svg.append("g").attr("class","legend");t.attr("transform","translate(".concat(this.config.width-90,", 0)")),this.config.cohorts.forEach(function(a,n){var i=t.append("g").attr("class","legend__category").attr("transform","translate(0, ".concat(n*e.cohortHeight,")"));i.append("rect").attr("class","fill-color-".concat(n+1)).attr("width",e.cohortHeight).attr("height",e.cohortHeight),i.append("text").attr("class","legend__label").text(a).attr("transform","translate(".concat(e.cohortHeight+5,", ").concat(e.cohortHeight-5,")"))})}},{key:"calculateScaleBoundDates",value:function(e,t){var a=new Date(e),n=new Date(t),i=this.config,r=i.scaleStartDate,o=i.scaleEndDate;return a<r?a=r:a>o&&(a=o),n>o?n=o:n<r&&(n=r),[a,n]}},{key:"calculateSectionWidth",value:function(e){var t=this.calculateScaleBoundDates(e.startDate,e.endDate),a=Object(A.a)(t,2),n=a[0],i=a[1];return this.x(i)-this.x(n)}},{key:"calculateSectionXPos",value:function(e){var t=this.calculateScaleBoundDates(e.startDate)[0];return this.x(t)}},{key:"positionYearLabel",value:function(e){if(new Date(e.endDate)<this.config.scaleStartDate||new Date(e.startDate)>this.config.scaleEndDate)return"translate(".concat(1e3,", ",this.cohortHeight-4,")");var t=this.calculateScaleBoundDates(e.startDate,e.endDate),a=Object(A.a)(t,2),n=a[0],i=a[1],r=(this.x(n)+this.x(i))/2-2,o=this.x(this.config.scaleEndDate);return r=r<20?r+15:r,r=Math.abs(r-o)<20?r-15:r,"translate(".concat(r,", ").concat(this.cohortHeight-4,")")}},{key:"moveTo",value:function(e,t){this.svg.attr("transform","translate(".concat(e,", ").concat(t,")"))}},{key:"update",value:function(){var e=this;this.config.showXAxis&&this.drawXAxis(),this.config.showLegend&&this.drawLegend();var t=this.svg.selectAll(".timeline").data(this.data).enter().append("g").attr("class","timeline");t.attr("transform",function(t){return"translate(0, ".concat(e.y(t.category.en)-e.xAxisPadding,")")}),this.config.categories.forEach(function(a,n){n<e.config.categories.length-1&&t.filter(function(e){return e.category.en===a.en}).append("line").attr("class","timeline__separator").attr("x1",e.x(e.config.scaleStartDate)-60).attr("y1",e.y.bandwidth()+.075*e.y.bandwidth()).attr("x2",e.x(e.config.scaleEndDate)).attr("y2",e.y.bandwidth()+.075*e.y.bandwidth())}),t.append("text").attr("class","timeline__title").text(function(t){return t.category[e.config.lang]}).attr("text-anchor","end").attr("dy",this.y.bandwidth()/2+5).attr("dx","-1.5em");var a=t.selectAll("timeline__section").data(function(e){return e.data}).enter().append("g").attr("class","timeline__section");a.filter(function(e){return new Date(e.startDate).getFullYear()!==new Date(e.endDate).getFullYear()}).append("rect").attr("class","timeline__rect").attr("x",function(t){return e.calculateSectionXPos(t)}).attr("height",this.cohortHeight).attr("width",function(t){return e.calculateSectionWidth(t)}),a.filter(function(e){return new Date(e.startDate).getTime()===new Date(e.endDate).getTime()}).append("circle").attr("r",function(t){return new Date(t.startDate)<e.config.scaleStartDate||new Date(t.endDate)>e.config.scaleEndDate?0:e.cohortHeight/2}).attr("class","timeline__rect").attr("cx",function(t){return e.calculateSectionXPos(t)}).attr("cy",this.cohortHeight/2),a.append("text").attr("class","timeline__year-label").text(function(t){return e.constructor.createYearLabel(t)}).attr("text-anchor","middle").attr("transform",function(t){return e.positionYearLabel(t)}),this.config.cohorts.forEach(function(t,n){a.filter(function(e){return e.cohort===t}).attr("transform","translate(0, ".concat(e.cohortHeight*n,")")).select(".timeline__rect").attr("class","timeline__rect fill-color-".concat(n+1))})}}],[{key:"prepareData",value:function(e,t){var a=[];return t.categories.forEach(function(t){a.push({category:t,data:e.filter(function(e){return e.category.en===t.en})})}),a}},{key:"findEarliestStartDate",value:function(e){return T.min(e,function(e){return new Date(e.startDate)})}},{key:"findLatestEndDate",value:function(e){return T.max(e,function(e){return new Date(e.endDate)})}},{key:"createYearLabel",value:function(e){var t=new Date(e.startDate),a=new Date(e.endDate),n=t.getMonth(),i=a.getMonth(),r=t.getFullYear(),o=a.getFullYear(),s=0===n?r:"".concat(n+1,"/").concat(r),c=11===i?o:"".concat(a.getMonth()+1,"/").concat(o);if(r===o){if(n===i)return s;if(0===n&&11===i)return r}return"".concat(s,"\u2014").concat(c)}}]),e}());function z(e){return function(e){return e.split(".")[0]}(e).replace(/ /g,"")}a(73);var M=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).hasManyCohortsSelected=Object.values(e.cohortFilter).filter(function(e){return e.isSelected}).length>4,a.showInfoBox=a.showInfoBox.bind(Object(g.a)(Object(g.a)(a))),a.hideInfoBox=a.hideInfoBox.bind(Object(g.a)(Object(g.a)(a))),a.treeConfigDefault={width:350,height:100,posX:125,posY:50,childrenNames:["registers","registerDetails"],nodeSize:7.5},a.timelineConfigDefault={width:250,height:100,showXAxis:!!a.hasManyCohortsSelected,showLegend:!!a.hasManyCohortsSelected,xAxisOrientation:a.hasManyCohortsSelected?"top":"bottom",scaleEndDate:new Date},a.state={infoBoxes:[]},a}return Object(f.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props,a=t.data,n=t.lang,i=this.props,r=i.filename,o=i.cohortFilter,s=i.treeFilter,l=i.treeConfig,u=i.timelineConfig,d=a.registers.filter(function(e){return s[e.name.en].isSelected}).map(function(e){return Object(c.a)({},e)});d.forEach(function(e){e.registerDetails=e.registerDetails.filter(function(t){return s[e.name.en].registerDetails[t.name.en].isSelected}).map(function(e){return Object(c.a)({},e)})});var h=Object.values(o).filter(function(e){return e.isSelected}),f=20*h.length*2+30,g=Object(c.a)({},a,{registers:d}),m=function(e){var t=0;return e.registers.forEach(function(e){return e.registerDetails.forEach(function(){return t+=1})}),t}(g)*f;this.treeConfigDefault.height=m;var p=Object(c.a)({},this.treeConfigDefault,l),v=T.select(".js-timeline-tree#".concat(z(r))).attr("height",m+100).attr("width",1050),y=new L(g,v,p);y.updateNodes(),y.updateLinks();var w={height:f,width:350,cohorts:h.map(function(e){return e.name})},b=Object(c.a)({},this.timelineConfigDefault,u,w);y.treeData.children&&y.treeData.children.forEach(function(t,a){var i=e.state.infoBoxes;t.children.filter(function(e){return""!==e.data.notes[n]}).forEach(function(e){return i.push({isShown:!1,text:e.data.notes,x:e.y,y:e.x})}),e.setState({infoBoxes:i}),t.children.forEach(function(e,t){var n=b;0===a&&0===t&&(n=Object(c.a)({},b,{showXAxis:!0,showLegend:!0,xAxisOrientation:"top"}));var i=e.data.samplings.filter(function(e){return o[e.cohort].isSelected}),r=new B(i,v,n);r.moveTo(e.y+300,e.x+50+10-f/2),r.update()})})}},{key:"componentWillUnmount",value:function(){for(var e=this.props.filename,t=document.querySelector(".js-timeline-tree#".concat(z(e)));t.firstChild;)t.removeChild(t.firstChild)}},{key:"showInfoBox",value:function(e){var t=this.state.infoBoxes;t[e].isShown=!0,this.setState({infoBoxes:t})}},{key:"hideInfoBox",value:function(e){var t=this.state.infoBoxes;t[e].isShown=!1,this.setState({infoBoxes:t})}},{key:"render",value:function(){var e=this,t=this.state.infoBoxes,a=this.props,n=a.filename,r=a.lang,o=t.filter(function(e){return e.isShown}).map(function(e){var t={position:"absolute",left:"".concat(e.x+125,"px"),top:"".concat(e.y+60,"px"),width:"175px"};return i.a.createElement(O,{layoutStyles:t,key:"".concat(Object.values(e).join(""),"Els")},e.text[r])}),s=t.map(function(t,a){var n={position:"absolute",left:"".concat(t.x+200,"px"),top:"".concat(t.y+32,"px")};return i.a.createElement("img",{key:"".concat(Object.values(t).join(""),"Btns"),style:n,className:"openInfoBtn",src:"assets/material-info-gray.svg",alt:"cohort info",onMouseEnter:function(){return e.showInfoBox(a)},onMouseLeave:function(){return e.hideInfoBox(a)}})});return i.a.createElement("div",{className:"svgContainer"},i.a.createElement("svg",{id:z(n),className:"js-timeline-tree timeline-tree"}),s,o)}}]),t}(n.Component),I=(a(75),function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).handleYearSelection=a.handleYearSelection.bind(Object(g.a)(Object(g.a)(a))),a.state={scaleYearsSlider:{min:1900,max:2018},scaleYears:{min:1900,max:2018}},a}return Object(f.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.timelineConfig.scaleStartDate.getFullYear(),t=(new Date).getFullYear();this.setState({scaleYearsSlider:{min:e,max:t}}),this.setState({scaleYears:{min:e,max:t}})}},{key:"handleYearSelection",value:function(e,t){var a=this.state.scaleYearsSlider;switch(t){case"change":this.setState({scaleYearsSlider:{min:e.min,max:e.max}});break;case"afterChange":this.setState({scaleYears:a});break;default:console.log("no such event mode")}}},{key:"render",value:function(){var e=this.props,t=e.lang,a=e.show,n=e.filename,r=e.data,o=e.cohortFilter,s=e.fileFilter,l=e.treeConfig,u=e.timelineConfig,d=this.state,h=d.scaleYearsSlider,f=d.scaleYears,g=new Date("".concat(f.min,"-01-01")),m=new Date("".concat(f.max,"-12-31")),p=Object(c.a)({},u,{scaleStartDate:g,scaleEndDate:m}),v=a?"timeline-tree-wrapper card":" timeline-tree-wrapper card card--collapsed",y=s.registers,w=Object.values(y).map(function(e){return"".concat(e.isSelected).concat(Object.values(e.registerDetails).map(function(e){return e.isSelected}).join(""))}).join("")+Object.values(o).map(function(e){return e.isSelected}).join("")+f.min+f.max+t;return i.a.createElement("div",{className:v},i.a.createElement(j,{lang:t,name:s.name,selectedYears:h,handleYearSelection:this.handleYearSelection}),s.isSelected?i.a.createElement(M,{lang:t,data:r,cohortFilter:o,treeFilter:y,treeConfig:l,timelineConfig:p,filename:n,key:w}):null)}}]),t}(n.Component)),R=(a(77),function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(u.a)(this,Object(d.a)(t).call(this,e))).selectLang=a.selectLang.bind(Object(g.a)(Object(g.a)(a))),a.updateTreeFilterWithKeyword=a.updateTreeFilterWithKeyword.bind(Object(g.a)(Object(g.a)(a))),a.toggleCohortFilter=a.toggleCohortFilter.bind(Object(g.a)(Object(g.a)(a))),a.toggleFileFilter=a.toggleFileFilter.bind(Object(g.a)(Object(g.a)(a))),a.toggleKeywordFilter=a.toggleKeywordFilter.bind(Object(g.a)(Object(g.a)(a))),a.toggleRegisterFilter=a.toggleRegisterFilter.bind(Object(g.a)(Object(g.a)(a))),a.resetRegisterDetailFilters=a.resetRegisterDetailFilters.bind(Object(g.a)(Object(g.a)(a))),a.data={},a.keywords={},a.filenames=[],a.state={dataset:"",filterMode:"manual",lang:"",cohortFilter:{},keywordFilter:{en:[],fi:[]},treeFilter:{},treeConfig:{},timelineConfig:{},infoMsg:{en:"Please select which register adminstrators you want to view from the panel on the left.",fi:"Valitse haluttu rekisteriyll\xe4pit\xe4j\xe4 paneelista vasemmalla."}},a}return Object(f.a)(t,e),Object(h.a)(t,null,[{key:"checkURLParams",value:function(e){var t=e.searchParams.get("lang"),a=e.searchParams.get("ds"),n=t||"fi",i=a||"finnish-birth-cohorts";return["en","fi"].includes(t)&&(n=t),["finnish-birth-cohorts","psycohorts"].includes(a)&&(i=a),window.history.pushState(null,"","?lang=".concat(n,"&ds=").concat(i)),{lang:n,dataset:i}}},{key:"initializeCohortFilter",value:function(e){var t={};return e.forEach(function(e){t[e]={isSelected:!0,name:e}}),t}},{key:"initializeConfigs",value:function(e){var t={};switch(e){case"finnish-birth-cohorts":t={cohorts:["1987","1997"],scaleStartDate:new Date("1987-01-01")};break;case"psycohorts":t={cohorts:["1966","1986","1987","1997","2007","FIPS-ADHD","FIPS-ASD","FIPS-Tourette","FIPS-Conduct dis.","FIPS-Anxiety","FIPS-Depression","FIPS-Schizophrenia","FIPS-Bipolar","FIPS-Learning dis.","FIPS-OCD","SSRI"],scaleStartDate:new Date("1966-01-01")};break;default:console.log("Given dataset was not found!")}return t}},{key:"initializeKeywordFilter",value:function(e){var t={};return Object.keys(e).forEach(function(a){t[a]={},e[a].forEach(function(e){t[a][e]={isSelected:!1}})}),t}},{key:"initializeRegisters",value:function(e){var t=this,a=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i={};return e.registers.forEach(function(e){i[e.name.en]={name:Object(c.a)({},e.name),isSelected:a,keywords:Object(c.a)({},e.keywords),registerDetails:t.initializeRegisterDetails(e,n)}}),i}},{key:"initializeRegisterDetails",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a={};return e.registerDetails.forEach(function(e){a[e.name.en]={name:Object(c.a)({},e.name),isSelected:t,keywords:Object(c.a)({},e.keywords)}}),a}}]),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=new URL(window.location.href),a=this.constructor.checkURLParams(t),n=a.dataset,i=a.lang,r=this.constructor.initializeConfigs(n,i),o=this.constructor.initializeCohortFilter(r.cohorts);fetch("data/".concat(n,"/data_bundle.json")).then(function(e){return e.json()}).then(function(t){e.data=t.data,e.filenames=Object.keys(e.data),e.keywords=t.keywords;var a=e.constructor.initializeKeywordFilter(t.keywords),s=e.initializeTreeFilter(e.filenames);e.setState({cohortFilter:o,dataset:n,keywordFilter:a,treeFilter:s,lang:i,timelineConfig:r})})}},{key:"selectLang",value:function(e){var t=this.state.dataset;this.setState({lang:e}),window.history.pushState(null,"","?lang=".concat(e,"&ds=").concat(t))}},{key:"initializeTreeFilter",value:function(e){var t=this,a=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n={};return e.forEach(function(e){n[e]={name:Object(c.a)({},t.data[e].name),isSelected:!1,keywords:Object(c.a)({},t.data[e].keywords),registers:t.constructor.initializeRegisters(t.data[e],a)}}),n}},{key:"resetRegisterDetailFilters",value:function(){var e=this.state.treeFilter,t={};Object.keys(e).forEach(function(a){var n=e[a],i=Object(c.a)({},n,{registers:{}});Object.keys(n.registers).forEach(function(e){var t=n.registers[e],a=Object(c.a)({},t,{registerDetails:{}});Object.keys(t.registerDetails).forEach(function(e){var n=t.registerDetails[e],i=Object(c.a)({},n,{isSelected:!0});a.registerDetails[e]=i}),i.registers[e]=a}),t[a]=i}),this.setState({treeFilter:t})}},{key:"toggleFileFilter",value:function(e){var t=this.constructor.initializeKeywordFilter(this.keywords);this.setState(function(a){return p()(a,{treeFilter:Object(s.a)({},e,{isSelected:{$apply:function(e){return!e}}}),keywordFilter:{$set:t},filterMode:{$set:"manual"}})})}},{key:"toggleRegisterFilter",value:function(e,t){var a=this.state.filterMode,n=this.constructor.initializeKeywordFilter(this.keywords);"keywords"===a&&this.resetRegisterDetailFilters(e),this.setState(function(a){return p()(a,{treeFilter:Object(s.a)({},e,{registers:Object(s.a)({},t,{isSelected:{$apply:function(e){return!e}}})}),keywordFilter:{$set:n},filterMode:{$set:"manual"}})})}},{key:"toggleCohortFilter",value:function(e){this.setState(function(t){return p()(t,{cohortFilter:Object(s.a)({},e,{isSelected:{$apply:function(e){return!e}}})})})}},{key:"toggleKeywordFilter",value:function(e){var t=this.state,a=t.lang,n=t.keywordFilter,i=!n[a][e].isSelected;Object.keys(n[a]).forEach(function(e){n[a][e].isSelected=!1});var r=p()(n,Object(s.a)({},a,Object(s.a)({},e,{isSelected:{$set:i}}))),o=this.updateTreeFilterWithKeyword(e,i);this.setState({keywordFilter:r,treeFilter:o,filterMode:"keywords"})}},{key:"updateTreeFilterWithKeyword",value:function(e,t){var a=this.state.lang;if(!t)return this.initializeTreeFilter(this.filenames);var n=this.initializeTreeFilter(this.filenames,!1);return Object.keys(n).forEach(function(t){var i=n[t],r=i.keywords[a].includes(e);i.isSelected=r,r&&Object.keys(i.registers).forEach(function(t){var n=i.registers[t],r=n.keywords[a].includes(e);n.isSelected=r,r&&Object.keys(n.registerDetails).forEach(function(t){var i=n.registerDetails[t],r=i.keywords[a].includes(e);i.isSelected=r})})}),n}},{key:"render",value:function(){var e=this,t=this.state,a=t.cohortFilter,n=t.keywordFilter,r=t.treeFilter,o=t.lang,s=t.infoMsg,l=t.treeConfig,u=t.timelineConfig,d=this.filenames.map(function(e){return{filename:e,name:r[e].name}}).map(function(t){var n=t.filename,s=r[n];return i.a.createElement(I,{lang:o,show:r[n].isSelected,filename:n,data:e.data[n],cohortFilter:a,fileFilter:s,treeConfig:Object(c.a)({},l,{lang:o}),timelineConfig:Object(c.a)({},u,{lang:o}),key:n})});return i.a.createElement(i.a.Fragment,null,i.a.createElement(k,{lang:o,cohortFilter:a,keywordFilter:n,treeFilter:r,selectLang:this.selectLang,toggleCohortFilter:this.toggleCohortFilter,toggleFileFilter:this.toggleFileFilter,toggleKeywordFilter:this.toggleKeywordFilter,toggleRegisterFilter:this.toggleRegisterFilter}),i.a.createElement("div",{className:"content-wrapper"},i.a.createElement("div",{className:"sidebar-placeholder"}),i.a.createElement("main",{className:"chart-area"},i.a.createElement("h2",{className:"info-header"},s[o]),d)))}}]),t}(n.Component)),X=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function H(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}o.a.render(i.a.createElement(R,null),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/meta-visu",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("/meta-visu","/service-worker.js");X?(function(e){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):H(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ")})):H(e)})}}()}},[[27,2,1]]]);
//# sourceMappingURL=main.a96733e0.chunk.js.map