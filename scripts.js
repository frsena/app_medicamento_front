document.querySelector('form').addEventListener('submit', function( event ) {
  event.preventDefault();
});

/* inicio dos metodos que chamam o api */ 

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/medicamentos';
  fetch(url, {
    method: 'get',
  })
    .then(response =>  response.json()
    .then(data => ({status: response.status,  data})))
    .then((obj) => {
      if(obj.status == 200){
        //removeTodaLista();
        obj.data.forEach(medicamento => insertList(medicamento.id,medicamento.remedio.nome,
           medicamento.descricao, medicamento.quantidade_vezes_dia, medicamento.observacao,
           medicamento.quantidade_dia, medicamento.data_inicio_medicacao))
       }else
          if(obj.status == 404){
            alert(obj.data.mesage);
          } else{
            alert("Não foi possível carregar os dados!");
          }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}




/*
  --------------------------------------------------------------------------------------
  Função que pesquisa o medicamento pelo id ou descrição
  --------------------------------------------------------------------------------------
*/
const pesquisarMedicamento = async (pesq) => {
  let url = 'http://127.0.0.1:5000/pesquisa' + pesq;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json()
    .then(data => ({status: response.status,  data})))
    .then((obj) => {
      if(obj.status == 200){
        removeTodaLista();
        obj.data.forEach(medicamento => insertList(medicamento.id,medicamento.remedio.nome,
         medicamento.descricao, medicamento.quantidade_vezes_dia, medicamento.observacao,
         medicamento.quantidade_dia, medicamento.data_inicio_medicacao))
      }else
          if(obj.status == 404){
            alert(obj.data.mesage);
          } else{
            alert("Não foi possível carregar os dados!");
          }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função que busca o medicamento pelo id para iniciar a alteracao
  --------------------------------------------------------------------------------------
*/
const getMedicamentoIdAlterar = async (id) => {
  let url = 'http://127.0.0.1:5000/medicamento?id='+ id;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json()
    .then(data => ({status: response.status,  data})))
    .then((obj) => {
      if(obj.status == 200){
        data = obj.data;
        popularForm(data.id,data.remedio.id,
          data.descricao, data.quantidade_vezes_dia, data.observacao,
          data.quantidade_dia, data.data_inicio_medicacao);
      }else
        if(obj.status == 404){
          alert(obj.data.mesage);
        } else{
          alert("Não foi possível carregar os dados!");
        }

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar um medicamento na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const enviarNovoMedicamento = async (medicamento) => {
 

  let url = 'http://127.0.0.1:5000/medicamento';
  fetch(url, {
    method: 'post',
    body: medicamento,
  })
    .then((response) => response.json()
    .then(data => ({status: response.status,  data})))
    .then((obj) => {
        if(obj.status == 200){
          data = obj.data;
          insertList(data.id,data.remedio.nome,
            data.descricao, data.quantidade_vezes_dia, data.observacao,
            data.quantidade_dia, data.data_inicio_medicacao)
            fecharJanela();
          alert("Medicamento adicionado!");
        }else
          if(obj.status == 400){
            alert(obj.data.mesage);
          } else{
            alert("Não foi possível salvar novo medicamento!");
          }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar um medicamento na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const enviarMedicamentoAlterado = async (medicamento) => {

  let url = 'http://127.0.0.1:5000/atualizar';
  fetch(url, {
    method: 'put',
    body: medicamento
  })
    .then((response) => response.json()
    .then(data => ({status: response.status,  data})))
    .then((obj) => {
        if(obj.status == 200){
          data = obj.data;
          alteraMedicamentoLista(data.id,data.remedio.nome,
            data.descricao, data.quantidade_vezes_dia, data.observacao,
            data.quantidade_dia, data.data_inicio_medicacao)
          alert("Medicamento Alterado!");
        }else 
          if(obj.status == 400){
              alert(obj.data.mesage);
          } else{
              alert("Não foi possível alterar o medicamento!");
          }

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um Medicamento da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteMedicamento = (id, elemento) => {
  let url = 'http://127.0.0.1:5000/delete?id=' + id;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json()
    .then(data => ({status: response.status,  data})))
    .then((obj) => {
        if(obj.status == 200){
          elemento.remove();
          alert(obj.data.mesage);
        }else 
          if(obj.status == 404){
            alert(obj.data.mesage);
          } else{
              alert("Não foi possível excluir o medicamento!");
          }
          
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getListRemedios = async () => {
  let url = 'http://127.0.0.1:5000/remedios';
  fetch(url, {
    method: 'get',
  })
    .then(response =>  response.json()
    .then(data => ({status: response.status,  data})))
    .then((obj) => {
    
      if(obj.status == 200){
        obj.data.forEach(remedio => insertListRemedio(remedio.id, remedio.nome));
      } 
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}




/* Fim dos metodos que chamam o api */ 



/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento da lista inicial
  --------------------------------------------------------------------------------------
*/
const iniciar =  () => {
  
  getList();
  getListRemedios();

}

const formatarData = (data) => {
 
  let formatador = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short', 
    timeStyle: 'medium', 
    hour12: false
  });
  return formatador.format(new Date(data)).replace(/, /g, " ");
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir medicamentos na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id, nome, descricao,
                    quantidade_vezes_dia, observacao,
                    quantidade_dia, data_inicio_medicacao) => {

                    

  var medicamento = [id, nome, descricao, quantidade_vezes_dia,
                      quantidade_dia, formatarData(data_inicio_medicacao), observacao]

  var table = document.querySelector('#myBody');
  var row = table.insertRow();
  row.id = "medicamento"+id;

  for (var i = 0; i < medicamento.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = medicamento[i];
    if(i==0 || i==3 || i ==4)
      cel.align="center"
  }
  insertButton(row.insertCell(-1), id);
  
  limparForm();
}

/*
  --------------------------------------------------------------------------------------
  Função para carregar a combo de remedio
  --------------------------------------------------------------------------------------
*/
const insertListRemedio = (id, nome) => {
  let select = document.querySelector("#remedio_id"); 
  let opt = document.createElement('option');
  opt.value = id;
  opt.innerHTML = nome;
  select.appendChild(opt);
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir os botoes de ação na lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent, id) => {
  let span = document.createElement("span");
 
  insertButtonEditar(span, id);
  insertButtonRemover(span, id);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão remover para cada medicamento da lista
  --------------------------------------------------------------------------------------
*/
const insertButtonRemover = (span, id) => {
  let img = document.createElement('img');
  img.src ='excluir.png';
  img.width="20";
  img.height="20";
  img.onclick = excluir
  img.value = id;
  img.classList.add('imgLink');
  span.appendChild(img);
}

/*
  --------------------------------------------------------------------------------------
  Função que é chamada ao clicar no botao de excluir na lista
  --------------------------------------------------------------------------------------
*/
const excluir = (e) => {
  let id = e.target.value;
  let elemento = e.target.parentNode.parentNode.parentNode;
  if (confirm("Confirma a exclusão?")) {
    deleteMedicamento(id, elemento);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de editar para cada medicamento da lista
  --------------------------------------------------------------------------------------
*/
const insertButtonEditar = (span, id) => {
  let img = document.createElement('img');
  img.src ='edit-text.png';
  img.width="20";
  img.height="20";
  img.onclick = inciarAltercao
  img.value = id;
  img.classList.add('imgLink');
  span.appendChild(img);
}

/*
  --------------------------------------------------------------------------------------
  Função que é chamada ao clicar no botao de editar na lista
  --------------------------------------------------------------------------------------
*/
const inciarAltercao = (e) => {
  let id = e.target.value;
  getMedicamentoIdAlterar(id);

}

/*
  --------------------------------------------------------------------------------------
  Metodo que remove todas as linhas da tabela
  --------------------------------------------------------------------------------------
*/
const removeTodaLista = () => {
  var table = document.querySelector('#myBody');
  while (table.rows.length > 0)
  { 
    table.deleteRow(0); 
  }
}

/*
  --------------------------------------------------------------------------------------
  Metodo que troca o tipo de pesquisa conforme a seleção na tela
  --------------------------------------------------------------------------------------
*/
const trocaType = () => {
  var escolha =  document.querySelector('#escolhaPesquisa option:checked').value;
  document.querySelector('#pesquisa').value = "";
  document.querySelector('#pesquisa').disabled = "";
  if(escolha == "ID"){
    document.querySelector('#pesquisa').type = "number";
    document.querySelector('#pesquisa').placeholder = "Código";
    document.querySelector('#pesquisa').min="1"
    
  } else 
    if(escolha == "DESC"){
      document.querySelector('#pesquisa').type = "text";
      document.querySelector('#pesquisa').placeholder = "Descrição";
    }
    else {
      document.querySelector('#pesquisa').type = "text";
      document.querySelector('#pesquisa').placeholder = "";
      document.querySelector('#pesquisa').disabled = "true";
    }
}


/*
  --------------------------------------------------------------------------------------
  Metodo de pesquisa conforme a seleção na tela
  --------------------------------------------------------------------------------------
*/
const pesquisar = () => {
  var escolha =  document.querySelector('#escolhaPesquisa option:checked').value;
  
  pesq = document.querySelector('#pesquisa').value;
  
  if(escolha == "ID"){
    pesq = "?id="+pesq;  
  }else
    if(escolha == "DESC"){
      pesq = "?descricao="+pesq;
    } else{
      pesq ="";
    }

  pesquisarMedicamento(pesq);

}

/*
  --------------------------------------------------------------------------------------
  Iniciar a tela de incluir
  --------------------------------------------------------------------------------------
*/
const abrirTelaNovoMedicamento = () =>{
  limparForm();
  document.querySelector("#btAlterar").style="display:none";
  document.querySelector("#btIncluir").style="display:";
  //document.querySelector("#id").style="display:none";
  document.querySelector("#tituloDialog").textContent = "Nova Medicação";
  document.querySelector("#novoMedicamentoDialog").showModal();

  
}


/*
  --------------------------------------------------------------------------------------
  limpar o form da tela
  --------------------------------------------------------------------------------------
*/
const limparForm = () => {
  let formulario = document.querySelector('form');
  formulario.reset();

}


/*
  --------------------------------------------------------------------------------------
  Função para ler os dados do formulario
  --------------------------------------------------------------------------------------
*/
const lerFormulario = () => {

  const form = document.querySelector('form');
  const formData = new FormData(form); 

  return formData;
} 


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo medicamento
  --------------------------------------------------------------------------------------
*/
const salvarNovoMedicamento = () => {

  medicamento =  lerFormulario();

  if(validarFormulario(medicamento)){
    enviarNovoMedicamento(medicamento);
  }
}


/*
  --------------------------------------------------------------------------------------
  Função que altera o medicamento  na lista 
  --------------------------------------------------------------------------------------
*/
const alteraMedicamentoLista = (id, nome, descricao,
  quantidade_vezes_dia, observacao,
  quantidade_dia, data_inicio_medicacao) => {

  var medicamento =  [id, nome, descricao, quantidade_vezes_dia,
                      quantidade_dia, formatarData(data_inicio_medicacao), observacao]

  var tr = document.querySelector('#myBody tr[id=medicamento'+id+']');
 
  for (var i = 0; i < medicamento.length; i++) {
  
   tr.querySelectorAll("td")[i].textContent = medicamento[i];
  }
  
  limparForm();
  fecharJanela();
}





/*
  --------------------------------------------------------------------------------------
  Função para popular o formulario para altera o medicamento
  --------------------------------------------------------------------------------------
*/
const popularForm = (id, remedio_id, descricao,
                    quantidade_vezes_dia, observacao,
                    quantidade_dia, data_inicio_medicacao) => {

  document.querySelector("#id").style="display:";
  document.querySelector("#btAlterar").style="display:";
  document.querySelector("#btIncluir").style ="display:none";
  document.querySelector("#tituloDialog").textContent = "Alterar Medicação";

  document.querySelector("#id").value = id;
  document.querySelector("#descricao").value =descricao;
  document.querySelector("#quantidade_vezes_dia").value=quantidade_vezes_dia;
  document.querySelector("#observacao").value=observacao;
  document.querySelector("#quantidade_dia").value = quantidade_dia;
  
  document.querySelector("#data_inicio_medicacao").value =data_inicio_medicacao;
  document.querySelector("#remedio_id").value=remedio_id;
  
  document.querySelector("#novoMedicamentoDialog").showModal();
}



/*
  --------------------------------------------------------------------------------------
  Função para fechar o show modal
  --------------------------------------------------------------------------------------
*/
const fecharJanela = () => {
  document.querySelector("#novoMedicamentoDialog").close();
}



/*
  --------------------------------------------------------------------------------------
  Função para validar os campos de entrada do formulario
  --------------------------------------------------------------------------------------
*/
const validarFormulario = (medicamento) => {
  ok = true;
  if (medicamento.get('remedio_id') === '') {
    alert("Selecione um remédio!");
    return false;
  } 
  if (medicamento.get('descricao') === '') {
    alert("Favor informar a descrição!");
    return false;
  } 
  if (medicamento.get('quantidade_vezes_dia') === '') {
    alert("Favor informar a quantidade de vezes ao dia!");
    return false;
  } 
  if (medicamento.get('data_inicio_medicacao') === '') {
    alert("Favor infomar a data inicio!");
    return false;
  }  

  return true;
} 



const salvarAlteracao = () => {
  document.querySelector('#id').disabled = "";
  medicamento =  lerFormulario();
  document.querySelector('#id').disabled = "true";
  if(validarFormulario(medicamento)){
    enviarMedicamentoAlterado(medicamento);
  }
}