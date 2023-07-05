var tableNumber = null
AFRAME.registerComponent("markerhandler",{
    init: async function(){
        
        if(tableNumber === null){
            this.alertWelcome()
        }
        var dishes = await this.getDishes()

        this.el.addEventListener("markerFound", ()=>{
            console.log("Marcador encontrado")
            if(tableNumber !== null){
                var markerID = this.el.id
                this.handlerMarkerFound(dishes, markerID)
            }
        })

        this.el.addEventListener("markerLost", ()=>{ 
            console.log("Marcador perdido")
            this.handlerMarkerLost()
        })
    },
    alertWelcome: function(){
        var inconSave = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png"
        swal({
            title: "Bienvenido a la juguetería",
            icon: inconSave,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Escribe el número de la estantería que quieras",
                    type: "number",
                    min: 1
                }          
            },
            closeOnClickOutside: false
        })
        .then(
            inputValue =>{
                tableNumber = inputValue
            }
        )

    },
    handlerMarkerFound: function(dishes, markerID){
        // Obtener el día
var todaysDate = new Date();
var todaysDay = todaysDate.getDay();

// De domingo a sábado: 0 - 6
var days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

var dish = dishes.filter(dish => dish.id === markerID)[0];

if (dish.unavailable_days.includes(days[todaysDay])) {
  swal({
    icon: "warning",
    title: dish.dish_name.toUpperCase(),
    text: "¡Ese juguete no está disponible hoy!",
    timer: 2500,
    buttons: false
  });
} else {

    var modelChoice = document.querySelector(`#model-${dish.id}`)
    modelChoice.setAttribute("position", dish.model_geometry.position)
    modelChoice.setAttribute("rotation", dish.model_geometry.rotation)
    modelChoice.setAttribute("scale", dish.model_geometry.scale)
    modelChoice.setAttribute("visible", true)

    var ingChoice = document.querySelector(`#plane-${dish.id}`)
    ingChoice.setAttribute("visible", true)

    var priceChoice = document.querySelector(`#price-plane-${dish.id}`)
    priceChoice.setAttribute("visible", true)

    var buttons = document.getElementById("button-div")
    buttons.style.display = "flex"

    var order_button = document.getElementById("order-button")
    var raiting_button = document.getElementById("raiting-button")

    if(tableNumber !== null){ 
    order_button.addEventListener("click",()=>{
        var numberTable
        tableNumber <= 9 ?(numberTable = `s0${tableNumber}`) : `s${tableNumber}`
        this.updateDataBase(numberTable, dish)
        swal({
            icon: "https://i.imgur.com/4NZ6uLY.jpg", title: "Gracias por tu pedido", text: "recibirás tu juguete pronto", timer: 2000, buttons: false
        })
    })

    raiting_button.addEventListener("click", function(){
        swal({
            icon: "warning", title: "Calificar servicio", text: "Gracias por calificar"
        })
    }) 
    }
  }
},

updateDataBase: function(tableNumber, dish){
    firebase.firestore()
    .collection("estantes")
    .doc(tableNumber)
    .get()
    .then(
        doc=>{
            var tableDetails = doc.data()
            if(tableDetails["current_orders"][dish.id]){
                tableDetails["current_orders"][dish.id]["quantity"] += 1
                var countOrder = tableDetails["current_orders"][dish.id]["quantity"]
                tableDetails["current_orders"][dish.id]["subtotal"] = countOrder*dish.price
            }else{
                tableDetails["current_orders"][dish.id] = {
                    item: dish.nombre, 
                    price: dish.price,
                    quantity: 1,
                    subtotal: dish.price*1
                }
            }
            tableDetails.total_bill += dish.price
            firebase.firestore()
            .collection("estantes")
            .doc(doc.id)
            .update(tableDetails)
        }
    )

},
getDishes: async function(){
    return await firebase
    .firestore()
    .collection("juguetes")
    .get()
    .then(snap=>{
        return snap.docs.map(doc=>doc.data())
    })
},
    handlerMarkerLost: function(){
        var buttons = document.getElementById("buttons")
        buttons.style.display = "none"
    }
})