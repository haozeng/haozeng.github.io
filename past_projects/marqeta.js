jsPlumb.ready(function() {

  var instance = jsPlumb.getInstance({
    DragOptions : { cursor: "pointer", zIndex:2000 },
    HoverClass:"connector-hover"
  });

  var connectorStrokeColor = "rgba(50, 50, 200, 1)",
    connectorHighlightStrokeColor = "rgba(180, 180, 200, 1)",
    hoverPaintStyle = { strokeStyle:"#7ec3d9" };      // hover paint style is merged on normal style, so you
                                                          // don't necessarily need to specify a lineWidth

  //
  // connect window1 to window2 with a 13 px wide olive colored Bezier, from the BottomCenter of
  // window1 to 3/4 of the way along the top edge of window2.  give the connection a 1px black outline,
  // and allow the endpoint styles to derive their color and outline from the connection.
  // label it "Connection One" with a label at 0.7 of the length of the connection, and put an arrow that has a 50px
  // wide tail at a point 0.2 of the length of the connection.  we use 'cssClass' and 'endpointClass' to assign
  // our own css classes, and the Label overlay has three css classes specified for it too.  we also give this
  // connection a 'hoverPaintStyle', which defines the appearance when the mouse is hovering over it.
  //

  var stateMachineConnector = {
    connector:"StateMachine",
    paintStyle:{lineWidth:3,strokeStyle:"#056"},
    hoverPaintStyle:{strokeStyle:"#dbe300"},
    endpoint:"Blank",
    anchor:"Continuous",
    overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
  };

  instance.connect({
    source:"payment",
    target:"marqeta"
  }, stateMachineConnector);

  instance.connect({
    source:"marqeta",
    target:"payment"
  }, stateMachineConnector);

  instance.connect({
    source:"marqeta",
    target:"web"
  }, stateMachineConnector);

  instance.connect({
    source:"web",
    target:"marqeta"
  }, stateMachineConnector);

  instance.connect({
    source:"marqeta",
    target:"mobile"
  }, stateMachineConnector);

  instance.connect({
    source:"mobile",
    target:"marqeta"
  }, stateMachineConnector);

  instance.connect({
    source:"marqeta",
    target:"satelitte"
  }, stateMachineConnector);

  instance.connect({
    source:"satelitte",
    target:"marqeta"
  }, stateMachineConnector);

  instance.connect({
    source:"marqeta",
    target:"ipad"
  }, stateMachineConnector);

  instance.connect({
    source:"ipad",
    target:"marqeta"
  }, stateMachineConnector);

  // jsplumb event handlers

  // double click on any connection
  instance.bind("dblclick", function(connection, originalEvent) { alert("double click on connection from " + connection.sourceId + " to " + connection.targetId); });
  // single click on any endpoint
  instance.bind("endpointClick", function(endpoint, originalEvent) { alert("click on endpoint on element " + endpoint.elementId); });
  // context menu (right click) on any component.
  instance.bind("contextmenu", function(component, originalEvent) {
        alert("context menu on component " + component.id);
        originalEvent.preventDefault();
        return false;
    });

  // make all .window divs draggable. note that here i am just using a convenience method - getSelector -
  // that enables me to reuse this code across all three libraries. In your own usage of jsPlumb you can use
  // your library's selector method - "$" for jQuery, "$$" for MooTools, "Y.all" for YUI3.
  instance.draggable(jsPlumb.getSelector(".window"), { containment:".demo"});

  jsPlumb.fire("jsPlumbDemoLoaded", instance);
});
