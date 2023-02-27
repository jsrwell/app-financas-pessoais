class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == "" || this[i] == undefined || this[i] == null)
				return false
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperaTodosRegistros() {
		let despesas = []
		let id = localStorage.getItem('id')

		for(let i = 1; i <= id; i++){
			let despesa = JSON.parse(localStorage.getItem(i))
			if (despesa === null)
				continue

			despesa.id = i
			despesas.push(despesa)
		}
		return despesas
	}

	pesquisar(despesa) {
		let despesasFiltradas = []
		despesasFiltradas = this.recuperaTodosRegistros()
		//Filtros
		if(despesa.ano != "")
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		if(despesa.mes != "")
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		if(despesa.dia != "")
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		if(despesa.tipo != "")
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		if(despesa.descricao != "")
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		if(despesa.valor != "")
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
		pesquisarDespesa()
	}
}

let bd = new Bd()

function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
		)

	if(despesa.validarDados()) {
		bd.gravar(despesa)
		console.log("Dados Registrados")
		document.getElementById('mTitulo').className = "modal-header text-success"
		document.getElementById('mTitulo2').innerHTML = "Registro Inserido com Sucesso"
		document.getElementById('mTexto').innerHTML = "O registro foi inserido com sucesso."
		document.getElementById('mBotao').className = "btn btn-success"
		document.getElementById('mBotao').innerHTML = "Entendido"
		$('#avisoModal').modal('show')
		ano.value = ""
		mes.value = ""
		dia.value = ""
		tipo.value = ""
		descricao.value = ""
		valor.value = ""
	} else {
		console.log("Dados Inválidos")
		document.getElementById('mTitulo').className = "modal-header text-danger"
		document.getElementById('mTitulo2').innerHTML = "Erro na Gravação do Registro"
		document.getElementById('mTexto').innerHTML = "Um ou mais campos não foram preenchidos corretamente, por favor verifique!"
		document.getElementById('mBotao').className = "btn btn-danger"
		document.getElementById('mBotao').innerHTML = "Voltar e Corrigir"
		$('#avisoModal').modal('show')
	}
}

function carregaListaDespesas(despesas = [], filtro = false) {
	if (despesas.length == 0 && filtro == false)
	despesas = bd.recuperaTodosRegistros()

	//selecionando o elemento tbody
	let listaDespesas = document.getElementById('listaDespesas')
	//limpando tabela
	listaDespesas.innerHTML = ""
	//listando dados array
	despesas.forEach(function(d) {
		//criando linha
		let linha = listaDespesas.insertRow()
		//criando as colunas e inserindo dados
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
	switch (parseInt(d.tipo)) {
	case 1: d.tipo = "Alimentação"
		break
	case 2: d.tipo = "Educação"
		break
	case 3: d.tipo = "Lazer"
		break
	case 4: d.tipo = "Saúde"
		break
	case 5: d.tipo = "Transporte"
		break
	}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
		//criar coluna exclusão
		let btn = document.createElement("button")
		btn.className = "btn btn-danger"
		btn.innerHTML = "<i class='fas fa-times'></i>"
		btn.id = "id-despesa-" + d.id
		btn.onclick = function() {
			//remover despesa
			let id = this.id.replace("id-despesa-", "")
			bd.remover(id)
		}
		linha.insertCell(4).append(btn)
	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	let despesas = bd.pesquisar(despesa)

	//selecionando o elemento tbody
	carregaListaDespesas(despesas, true)
}