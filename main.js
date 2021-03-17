function viz(){
    const margin = { top: 20, left: 200, bottom: 30, right: 70 },
          width = 960 - margin.right - margin.left,
          height = 3200 - margin.top - margin.bottom,
          innerRadius = 60,
          outerRadius = 120,
          padding = 3;

          const svg = d3.select(".viz")
                      .append("svg")
                      .attr("width",width+margin.left+margin.right)
                      .attr("height",height+margin.top+margin.bottom)
                      .append("g")
                      .attr("transform","translate("+margin.left+","+margin.top+")")

        d3.csv("data/data.csv",function(d){
          return{
            project: d.Project,
            source: d.Source,
            type: d.Type,
            publish: d.Published,
            version: d.Version,
            link: d.Links
          }
        }).then(function(data){
          const project = Array.from(d3.rollup(data,v=>v.length,d=>d.project,d=>d.type,d=>d),
          ([key,values])=>{
            return{
              key,
              values
            }
          })
         
          const circleScaleX = d3.scaleOrdinal()
                                .domain(project,d=>d.key)
                                .range([-110,620])

          const circleScaleY = d3.scaleOrdinal()
                                .domain(project,d=>d.key)
                                .range([0,500,1050,1550,2050,2550])

          const color = d3.scaleOrdinal()
                          .range(["#d88c9a","#f2d0a9","#8e7dbe","#99c1b9","gold"])
          

          const point = svg.append("g")
             .attr("transform",`translate(50,180)`)
             .selectAll("project")
             .data(project)
             .join(enter=>{
               enter.append("circle")
                    .attr("class",d=>d.key)
                    .attr("r",(d,i)=>{if (i<=4){return 10}
                    else {return 50}})
                    .attr("cx",(d,i)=>{if (i<=4){return i*120}
                    else {return circleScaleX(d.key)}
            })
                    .attr("cy",(d,i)=>{if (i<=4){return 50}
                  else {return circleScaleY(d.key)}
            })
                    .style("fill",(d,i)=>{if (i<=4){return "transparent"}
                  else {return color(d.key)}})
                    .style("stroke",(d,i)=>{if (i<=4){return "#d88c9a"}
                  else {return color(d.key)}})
                    .style("stroke-width",1.5)

               
             
              
          })
          
          
          svg.selectAll("circle")
             .filter((d,i)=>i>=5)
             .each(trees)

                             



                  function trees(d,i){

                    const hierarchy = d3.hierarchy(d.values)

                    const tree = d3.tree()
                                   .size([Math.PI,220*1.3])

                    const root = tree(hierarchy)

                    const radial = d3.linkRadial()
                                  .angle(d=>d.x)
                                   .radius(d=>d.y)

                    const radials =  svg.append("g")
                                        .attr("transform",`translate(50,180)
                                               translate(${circleScaleX(d.key)},${circleScaleY(d.key)})`)

                                      radials.selectAll("tidy")
                                             .data(root.links())
                                             .join("path")
                                             .attr("d",i%2==0?radial.angle(d=>-d.x):radial.angle(d=>d.x))
                                            .style("fill","none")
                                            .style("stroke-width",d=>d.target.depth==1?0.8:1.3)
                                            .style("stroke",color(d.key))
                    

                                      radials.selectAll("circle")
                                             .data(root.descendants())
                                             .join("circle")
                                             .attr("transform", d => `
                                                   rotate(${i%2==0?d.x * -180 / Math.PI - 90:d.x*180 / Math.PI - 90})
                                                   translate(${d.y},0)
                                                  `)
                                             .attr("fill", color(d.key))
                                             .attr("r",d=>d.depth==1?0:3);
                  }


         const annotations = [
           {
            type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"horizontal",
               "align":"middle"}}),
             note: {
               label: "A finance grad who had just started to learn to code.",
               title: "Hello ! This is me in Jan, 2020.",
               wrap:150
             },
             x:0,
             y:40,
             dx:0,
             dy:-50,
             color:"#d88c9a"
           },
           {
            type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"horizontal",
               "align":"middle"}}),
             note: {
               label: "Came across 'Breathing City' by Dark Horse Analytics and was fully captivated.",
               title: "Intro to D3.js"
             },
             x:120,
             y:60,
             dx:0,
             dy:50,
             color:"#d88c9a"
           },
           {
            type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"horizontal",
               "align":"middle"}}),
             note: {
               label: "This gem taught me all the basics and more.",
               title: "Interactive Data Visualization for the Web by Scott Murray",
               wrap:155
             },
             x:240,
             y:40,
             dx:0,
             dy:-50,
             color:"#d88c9a"
           },
           {
            type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"horizontal",
               "align":"middle"}}),
             note: {
               label: "This book with all its follow along example code, another gem.",
               title: "D3.js in Action by Elijah Meeks"
             },
             x:360,
             y:60,
             dx:0,
             dy:50,
             color:"#d88c9a"
           },
           {
            type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"horizontal",
               "align":"middle"}}),
             note: {
               label: "Sat down and deconstructed Shirley Wu's code and made notes.",
               title: "Film Flowers by Shirley Wu"
             },
             x:480,
             y:40,
             dx:0,
             dy:-50,
             color:"#d88c9a"
           },
           {
            type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"horizontal",
               "align":"middle"}}),
             note: {
               label:"D3.js version 4",
               title: "Earthquakes: First D3 project."
             },
             x:620,
             y:450,
             dx:0,
             dy:-20,
             color:"#d88c9a"
           },
           {
             type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"vertical",
               "align":"middle"}}),
             note: {
               label: "74 example bl.ocks.",
               title: "Bl.ocks"
             },
             x:330,
             y:450,
             dx:-50,
             dy:0,
             color:"#d88c9a"
           },
           {
             type:d3.annotationCustomType(
               d3.annotationCalloutElbow,
               {"className":"custom",
               "note":{"lineType":"vertical",
               "align":"middle"}}),
             note: {
               label: "22 examples from other resources. (Mainly D3.js blogs.)",
               title: "Other"
             },
             x:460,
             y:750,
             dx:-50,
             dy:20,
             color:"#d88c9a"
           },
           {
             type:d3.annotationCustomType(
               d3.annotationCalloutElbow,
               {"className":"custom",
               "note":{"lineType":"vertical",
               "align":"middle"}}),
             note: {
               title: "Stackoverflow"
             },
             x:565,
             y:790,
             dx:-60,
             dy:50,
             color:"#d88c9a"
           },
           {
             type:d3.annotationCustomType(
               d3.annotationCallout,
               {"className":"custom",
               "note":{"lineType":"horizontal",
               "align":"middle"}}),
             note: {
               title: "Observable"
             },
             x:600,
             y:795,
             dx:0,
             dy:80,
             color:"#d88c9a"
           },
           {
            type:d3.annotationCustomType(
              d3.annotationCalloutCircle, 
              {"className":"custom",
              "connector":{"type":"elbow"},
              "note":{"lineType":"vertical",
              "align":"middle"}}),
             note: {
               label: "A total of 88 resources. 58% Bl.ocks, 27% Other and the rest 15% Stackoverflow + Observable.",
               title: "Under The Influence: Second Project (version 5 D3.js)",
               wrap:300,
               padding: 15
             },
             x:-110,
             y:1050,
             nx:350,
             ny:1080,
             color:"#f2d0a9",
             subject:{
               radius: 320,
             }
           },
           {
            type:d3.annotationCustomType(
              d3.annotationCalloutCircle, 
              {"className":"custom",
              "connector":{"type":"elbow"},
              "note":{"lineType":"vertical",
              "align":"middle"}}),
             note: {
               label: "63% Observable notebook examples, 30% Bl.ocks and 7% Other resources.",
               title: "Departed: Third Project (version 6 D3.js)",
               wrap:300,
               padding: 15
             },
             x:620,
             y:1550,
             nx:200,
             ny:1550,
             color:"#8e7dbe",
             subject:{
               radius: 320,
             }
           },
           {
            type:d3.annotationCustomType(
              d3.annotationCalloutCircle, 
              {"className":"custom",
              "connector":{"type":"elbow"},
              "note":{"lineType":"vertical",
              "align":"middle"}}),
             note: {
               label: "52% Observable notebook examples.",
               title: "World Power Plants: Fourth Project (version 6 D3.js)",
               wrap:300,
               padding: 15
             },
             x:-110,
             y:2050,
             nx:350,
             ny:2050,
             color:"#99c1b9",
             subject:{
               radius: 320,
             }
           },
           {
            type:d3.annotationCustomType(
              d3.annotationCalloutCircle, 
              {"className":"custom",
              "connector":{"type":"elbow"},
              "note":{"lineType":"vertical",
              "align":"middle"}}),
             note: {
               label: "65% Observable + Other resources.",
               title: "African American Writers: Fifth Project (version 6 D3.js)",
               wrap: 300,
               padding: 15
             },
             x:620,
             y:2550,
             nx:200,
             ny:2550,
             color:"gold",
             subject:{
               radius: 320,
             }
           },
         ]
         
         const makeAnnot = d3.annotation()
                             .type(d3.annotationCallout)
                             .annotations(annotations)

                             svg.append("g").attr("transform",`translate(50,180)`)
                                .call(makeAnnot)        

        })

}