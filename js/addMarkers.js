AFRAME.registerComponent("addmarker",{
    init: async function(){
        var saveScene = document.querySelector("#mainScene")
        var dishes = await this.getDishes()
        dishes.map(dish =>{
            var marker = document.createElement("a-marker")
            marker.setAttribute("id", dish.id)
            marker.setAttribute("type", "pattern")
            marker.setAttribute("url", dish.marker_pattern_url) 
            marker.setAttribute("cursor", {rayOrigin: "mouse"}) 
            marker.setAttribute("markerhandler", {})

            saveScene.appendChild(marker)

                  // Obtener el día
      var todaysDate = new Date();
      var todaysDay = todaysDate.getDay();
      // Domingo - Sábado : 0 - 6
      var days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado"
      ];

    if (!dish.unavailable_days.includes(days[todaysDay])) {
        
        var model = document.createElement("a-entity")
        model.setAttribute("id", `model-${dish.id}`)
        model.setAttribute("position", dish.model_geometry.position)
        model.setAttribute("rotation", dish.model_geometry.rotation)
        model.setAttribute("scale", dish.model_geometry.scale)
        model.setAttribute("gltf-model", `url(${dish.model_url})`)
        model.setAttribute("gesture-handler", {})
        model.setAttribute("visible", false)

        marker.appendChild(model)

        
        var juguete = document.createElement("a-plane")
        juguete.setAttribute("id", `plane-${dish.id}`)
        juguete.setAttribute("position", {x: 0, y: 0, z: 0})
        juguete.setAttribute("rotation", {x: -90, y: 0, z: 0} )
        juguete.setAttribute("width", 1.7)
        juguete.setAttribute("height", 1.5)
        ingredientes.setAttribute("visible", false)

        marker.appendChild(juguete)

        var title = document.createElement("a-plane")
        title.setAttribute("id", `planeTitle-${dish.id}`)
        title.setAttribute("position", {x: 0, y: 0.89, z: 0.02})
        title.setAttribute("rotation", {x: 0, y: 0, z: 0} )
        title.setAttribute("width", 1.69)
        title.setAttribute("height", 0.3)
        title.setAttribute("material", {color: "#F0C30F"})

        juguete.appendChild(title)

        var titleText = document.createElement("a-entity")
        titleText.setAttribute("id", `titleText-${dish.id}`)
        titleText.setAttribute("position", {x: 0, y: 0, z: 0.1})
        titleText.setAttribute("rotation", {x: 0, y: 0, z: 0} )
        titleText.setAttribute("text", {
            font: "monoid",
            color: "black",
            width: 1.8,
            height: 1,
            align: "center",
            value: dish.nombre.toUpperCase()
        })

        title.appendChild(titleText)

        var ingText = document.createElement("a-entity")
        ingText.setAttribute("id", `ingText-${dish.id}`)
        ingText.setAttribute("position", {x: 0.3, y: 0, z: 0.1})
        ingText.setAttribute("rotation", {x: 0, y: 0, z: 0} )
        ingText.setAttribute("text", {
            font: "monoid",
            color: "black",
            width: 1.8,
            height: 1,
            align: "left",
            value: `${dish.juguete.join("\n\n")}`
        })

        juguete.appendChild(ingText)

                //Plano para mostrar el precio del juguete
                var pricePlane = document.createElement("a-image");
                pricePlane.setAttribute("id", `price-plane-${dish.id}`);
                pricePlane.setAttribute(
                  "src",
                  "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
                );
                pricePlane.setAttribute("width", 0.8);
                pricePlane.setAttribute("height", 0.8);
                pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
                pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
                pricePlane.setAttribute("visible", false)
        
                //Precio del juguete
                var price = document.createElement("a-entity");
                price.setAttribute("id", `price-${dish.id}`);
                price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
                price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                price.setAttribute("text", {
                  font: "mozillavr",
                  color: "white",
                  width: 3,
                  align: "center",
                  value: `Solo\n $${dish.price}`
                });
        
                pricePlane.appendChild(price);
                marker.appendChild(pricePlane);
        
     }
    })
    

    },
    getDishes: async function(){
        return await firebase
        .firestore()
        .collection("juguetes")
        .get()
        .then(snap=>{
            return snap.docs.map(doc=>doc.data())
        })
    }
})