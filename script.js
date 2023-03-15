
//vetor local de toda a API
cervejas = new Array();
//vetor de pesquisa
att = new Array();
//pagina atual do usuário
pgatual = 1;

//baixa toda a API
async function baixarJSONs() {
    for (var i = 0; i < 5; i++) {
        await fetch("https://api.punkapi.com/v2/beers?page="+(i+1)+"&per_page=80", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }).then(response => response.json())
            .then(response => salvarCervejas(response, i))
    }

    console.log(cervejas);
}
//construtor das cervejas
function cerveja(id, name, tagline, firstbrew, desc, img, by) {
    this.id = id;
    this.name = name;
    this.tagline = tagline;
    this.firstbrew = firstbrew;
    this.desc = desc;
    this.img = img;
    this.by = by;
}
//guarda as cervejas no vetor local
function salvarCervejas(data, c) {
    for (var i = 0; i < data.length; i++) {  
        var cv = new cerveja(data[i].id, data[i].name, data[i].tagline, data[i].first_brewed, data[i].description, data[i].image_url, data[i].contributed_by);
        cervejas.push(cv);

    }
    att = cervejas;

    //se for a última lista, atualiza a pagina
    if (c == 4) {
        postarCervejas(1);
        paginas();
    }
   
}

//para fazer o sistema de paginação
function paginas() {
    var paginas = Math.ceil(att.length / 12);

    if (paginas == 0) {
        document.getElementById("paginas").innerHTML = "";
        return;
    }
    var antes = ((pgatual == 1) ? '<li class="page-item disabled3"><a class="page-link" href="#" tabindex="-1">Anterior</a>' : '<li class="page-item"><a class="page-link" href="#" tabindex="-1" id="ant">Anterior</a>' );
    var depois = ((pgatual == paginas ) ? '<li class="page-item disabled"> <a class="page-link" href="#">Seguinte</a> </li>' : '<li class="page-item"> <a class="page-link" href="#" id="pro">Seguinte</a> </li>');
    document.getElementById("paginas").innerHTML = antes;

    for (var i = 0; i < paginas; i++) {
        if (i+1 == pgatual)
            document.getElementById("paginas").innerHTML = document.getElementById("paginas").innerHTML + '<li class="page-item active"><a class="page-link" id ="page-' + (i + 1) + '" href="#">' + (i + 1) + '</a></li>';
        else
        document.getElementById("paginas").innerHTML = document.getElementById("paginas").innerHTML + '<li class="page-item"><a class="page-link" id ="page-'+(i+1)+'" href="#">' + (i + 1) + '</a></li>';
    }
    document.getElementById("paginas").innerHTML = document.getElementById("paginas").innerHTML + depois;
}

//para atualizar vetor local de acordo com a pesquisa do usuário
function pesquisa(entrada) {
    resultados = [];
    for (elemento of cervejas) {
        if (elemento.name.toLowerCase().includes(entrada.toLowerCase())) {
            resultados.push(elemento);
        }
    }
        att = resultados;
        infobox(false);
}

// mostrar mensagens de feedback
function infobox(empty) {

    var ad = '';
    if (empty) {
        ad = '<div class="alert alert-danger alert-dismissible fade show  mx-3"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Digite algo para pesquisar!</div>';
        $("#caixa").append(ad);
        return;
    } 
      
    if (att.length >0)
        ad = '<div class="alert alert-success alert-dismissible fade show  mx-3"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Foram encontrados ' + att.length + ' resultados.</div>';
    else
        ad = '<div class="alert alert-warning alert-dismissible fade show  mx-3"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Foram encontrados ' + att.length + ' resultados.</div>';

    $("#caixa").append(ad);

}

//postar todas as cervejas na pagina atual
function postarCervejas(atual) {

    
    for (var i = 0; i < 12; i++) {
        if (att[(atual - 1) * 12 + i] == null) {
        
            document.getElementById("card" + (i + 1)).classList.add("d-none");
           
            continue;
        }
        var linkimg = (att[(atual - 1) * 12 + i].img == null ? './broken.png' : att[(atual - 1) * 12 + i].img);
        var atualizado = '<img class="card-img-top mx-auto mt-3" style="width:60px;" src="' + linkimg + '" alt="Nome"><hr/><div class="card-body overflow:auto  "><h5 class="card-title">' + att[(atual - 1) * 12 + i].name + '</h5><p><em>' + att[(atual - 1) * 12 + i].tagline + '</em></p><p class="card-text desc">' + att[(atual - 1) * 12 + i].desc + '</p><hr /> <p class="card-text">Primeira fermenta&ccedil;&atilde;o em: ' + att[(atual - 1) * 12 + i].firstbrew + '</p><p class="card-text align-text-bottom">Criado por: ' + att[(atual - 1) * 12 + i].by +'</p> </div>';
        document.getElementById("card" + (i + 1)).classList.remove("d-none");
   
        document.getElementById("card" + (i + 1)).innerHTML = atualizado;
       
    }
    
}

//incorporar os triggers quando a pagina estiver carregadas
$(document).ready(function () {

    //mudança de pagina (voltar)
    document.body.addEventListener('click', function (event) {
        if (event.target.id == ("ant")) {
            if (pgatual == 1)
                return;
            event.preventDefault();
            pgatual--;
            postarCervejas(pgatual);
            paginas();

        };
    });

    //mudança de pagina (avançar)
    document.body.addEventListener('click', function (event) {
        if (event.target.id == "pro") {
            if (pgatual == Math.ceil(att.length / 12))
                return;
            event.preventDefault();
            pgatual++;;
            postarCervejas(pgatual);
            paginas();

        };
    });

    //pesquisa botão
    document.getElementById("pesquisar").addEventListener('click', function (event) {
        if (event.target.id == "pesquisar") {
            event.preventDefault();
            if (document.getElementById("pesquisa").value == "") {
                infobox(true);
                return;
            }
                
            pesquisa(document.getElementById("pesquisa").value);
            postarCervejas(1);
            pgatual = 1;
            paginas();
            
        };
    });


    //ir em página especifica
    document.body.addEventListener('click', function (event) {
        if (event.target.id.startsWith("page-")) {
            var pagina = event.target.id.split("-")[1];
            pgatual = pagina;
            event.preventDefault()
            postarCervejas(pagina);
            paginas();
        };
    });
});

//carrega a API quando começa a carregar a página
window.onload = baixarJSONs();

