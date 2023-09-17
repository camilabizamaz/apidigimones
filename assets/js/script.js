$(()=> {

    //contiene el pokemon que se está mostrando
    let currentPokemon;

    //va a contener todos los pokémones que registremos
    let arrayPokemones = [];


    /* CAPTURAR EL FORMULARIO */
    const formFindPokemon = $("#formFindPokemon");
    
    //ENCIENDO EVENTO SUBMIT DEL FORMULARIO
    formFindPokemon.on("submit", function(event){
        //QUITAMOS EL EVENTO POR DEFECTO DEL FORMULARIO (ACTUALIZAR PÁGINA)
        event.preventDefault();

        /* CAPTURAR ID O NOMBRE DEL POKEMON DESDE EL INPUT DEL FORMULARIO */
        let idOrName = $("#findPokemon").val();

        let rutaAPI = "https://pokeapi.co/api/v2/pokemon/"+idOrName;
        
        fetch(rutaAPI)
        .then(function(response){
            if(response.status == 404){
                /* SI EL SERVIDOR NOS RESPONDE CON UN 404 (NO ENCONTRADO)
                GENERAMOS UNA EXCEPCIÓN / ERROR QUE SE CAPTURA EN EL CATCH*/
                throw new Error("Pokémon no encontrado.");
            }
            //PERMITE RETORNAR LA DATA QUE DEVUELVE LA API (INFO DE POKÉMONES)
            return response.json();
        })
        .then(function(data){
            //EN DATA NOS LLEGA LA INFORMACIÓN DEL POKÉMON CONSULTADO
            //console.log(data);
            let habilidades = data.abilities.map(habilidad => {
                return habilidad.ability.name
            })
            
            //console.log(habilidades);

            let pokemon = {
                id: data.id,
                nombre: data.name,
                imagen: data.sprites.other.dream_world.front_default,
                habilidades: habilidades //array que contiene nombre de habilidades
                
            }
            console.log(pokemon);
          
          
            //dejamos como currentPokemon al actual pokémon
            currentPokemon = pokemon;

            cargarDatosPokemonCard(pokemon);
        })
        .catch(function(error){
            //CAPTURAMOS ERROR Y LO MOSTRAMOS EN UNA VENTANA EMERGENTE
            console.log(error);
            alert(error);
        })
    })


    function cargarDatosPokemonCard(pokemon){
        //se reemplaza imagen y alt que tiene el card por la imagen pokemon buscado y nombre
        $("#cardPokemon > img").attr("src", pokemon.imagen);
        $("#cardPokemon > img").attr("alt", pokemon.nombre);
        $("#cardPokemon .card-title").text(pokemon.nombre.toUpperCase());
        
        //SE CREA UN ACUMULADOR DE ELEMENTOS LI
        let liHabilidades = "";

        //RE RECORRE ARRAY DE HABILIDADES PARA CREAR TANTOS LI COMO HABILIDADES TENGA
        //EL POKÉMON
        pokemon.habilidades.forEach(function(habilidad){
            liHabilidades += `
                <li>${habilidad}</li>
            `
        })

        //LE AGREGAMOS LOS ELEMENTOS DE LISTA A LA UL (LISTA)
        $("#listaHabilidades").html(liHabilidades);
    }


    /* INICIO EVENTO CLIC BOTÓN REGISTRAR POKÉMON */

    $("#btnRegistrarPokemon").on("click", function(){
        //se valida que currentPokemon tenga datos de un pokémon.
        if(currentPokemon){
            arrayPokemones.push(currentPokemon);
            console.log(arrayPokemones);

            let filaMisPokemones = "";
            arrayPokemones.forEach(function(pokemon){
                filaMisPokemones += `
                <tr>
                    <th scope="row">${pokemon.id}</th>
                    <td>${pokemon.nombre}</td>
                    <td><img src="${pokemon.imagen}" alt="${pokemon.nombre}"></img></td>
                </tr>
                `
            });

            $("#cuerpoTabla").html(filaMisPokemones);
        }
    })

    /* FIN EVENTO CLIC BOTÓN REGISTRAR POKÉMON */

})