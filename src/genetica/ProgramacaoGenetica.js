import React, {Component} from "react";

export class Treinamento extends Component {

    constructor(matriz, totalArvores, totalTreino) {
        super();
        this.matriz = matriz;
        this.arvores = this.popular(totalArvores);
        this.treino = totalTreino;
        this.erroMedioGeral = Number.POSITIVE_INFINITY;
        this.arvoreCampea = this.getMelhor();
        this.valoresReais = this.getReais();
        this.labels = this.getLabels();
        this.dataSetErros = [];
        this.dataSetErrosLabel = [];
    }

    popular(totalArvores) {
        let arvores = [];
        for (let i = 0; i < totalArvores; i++) {
            arvores.push(new Arvore(this.matriz, i));
        }
        return arvores;
    }

    getMelhor() {
        let melhorFitness = Number.POSITIVE_INFINITY;
        let melhorArvore = null;

        for (let i = 0; i < this.arvores.length; i++) {
            let fitness = this.fitness(this.arvores[i], 0, this.treino);
            if (fitness < melhorFitness) {
                melhorFitness = fitness;
                melhorArvore = this.arvores[i];
            }
        }
        if (melhorArvore !== null) {
            return melhorArvore;
        } else {
            return this.arvores[0];
        }
    }

    treinar() {

        for (let i = 0; i < this.arvores.length; i++) {

            let arvoreMutada = this.clone(this.arvores[i]);
            arvoreMutada.mutar(this.matriz, this.arvoreCampea.id);

            let erroMedioAntes = this.fitness(this.arvores[i], 0, this.treino);
            let erroMedio = this.fitness(arvoreMutada, 0, this.treino);

            if (erroMedio < erroMedioAntes) {
                this.arvores[i] = arvoreMutada;
            }

            if (erroMedio < this.erroMedioGeral) {
                this.dataSetErros.push(erroMedio);
                this.dataSetErrosLabel.push(this.dataSetErros.length + 1);
                this.erroMedioGeral = erroMedio;
                this.arvoreCampea = this.clone(arvoreMutada);
            }

        }
    }

    clone(obj) {
        if (obj === null || typeof obj !== "object")
            return obj
        let props = Object.getOwnPropertyDescriptors(obj)
        for (let prop in props) {
            props[prop].value = this.clone(props[prop].value)
        }
        return Object.create(
            Object.getPrototypeOf(obj),
            props
        )
    }

    fitness(arvore, inicio, fim) {
        let erroMedio = 0;
        for (let i = inicio; i < fim; i++) {
            let valorPrevisto = arvore.processar(i, this.matriz);
            let valorReal = this.matriz[i][this.matriz[i].length - 1];
            erroMedio = erroMedio + (Math.pow(valorReal - valorPrevisto, 2));
        }
        return erroMedio;
    }

    getLabels() {
        let labels = [];
        for (let i = 0; i < this.matriz.length; i++) {
            labels.push(this.matriz[i][0]);
        }
        return labels;
    }

    getReais() {
        let reais = [];
        for (let i = 0; i < this.matriz.length; i++) {
            reais.push(this.matriz[i][this.matriz[i].length - 1]);
        }
        return reais;
    }

    previsao() {

        if (this.arvoreCampea !== null) {
            let previsao = [];
            for (let i = 0; i < this.matriz.length; i++) {
                previsao.push(this.arvoreCampea.processar(i, this.matriz));
            }
            return previsao;
        }
    }

    getFuncao() {
        if (this.arvoreCampea !== null) {
            return this.arvoreCampea.getFuncao();
        }
    }

    imprimirArvore() {

        return (
            <div className={"tree"}>
                {this.arvoreCampea !== null ? this.arvoreCampea.imprimirArvore() : ''}
            </div>
        )
    }
}


export class Arvore extends Component {

    constructor(matriz, id) {
        super();
        this.id = id;
        this.iniciar(matriz);
    }

    iniciar(matriz) {
        this.raiz = null;
        this.varia = false;
        for (let i = 0; i < Math.floor((Math.random() * 5) + 1); i++) {
            this.addNode(matriz);
        }
    }

    addNode(matriz) {
        if (this.raiz != null) {

            var aux = new Operador();
            var novo = new Operador();
            novo.setDireita(new Variavel(matriz));
            novo.setEsquerda(new Variavel(matriz));

            if (this.varia) {
                aux.setEsquerda(this.raiz);
                aux.setDireita(novo);
                this.varia = false;
            } else {
                aux.setDireita(this.raiz);
                aux.setEsquerda(novo);
                this.varia = true;
            }

            this.raiz = aux;
        } else {

            this.raiz = new Operador();
            this.raiz.setEsquerda(new Variavel(matriz));
            this.raiz.setDireita(new Variavel(matriz));
        }
    }

    processar(padrao, matriz) {
        return this.raiz.processar(padrao, matriz);
    }

    mutar(matriz, id) {
        if (this.id !== id && Math.floor((Math.random() * 5000) + 1) === 2) {
            console.log('nasceu de novo');
            this.iniciar(matriz);
        } else {

            var sort = Math.floor((Math.random() * 3) + 1);
            if (sort === 1) {
                this.addNode(matriz);

            } else if (sort === 2) {

                if (!this.raiz.getEsquerda().isTerminal()) {
                    this.raiz = this.raiz.getEsquerda();
                }

            } else if (!this.raiz.getDireita().isTerminal()) {
                this.raiz = this.raiz.getDireita();
            }
            this.raiz.mutar(matriz);
        }
    }

    getFuncao() {
        return this.raiz.getFuncao();
    }

    imprimirArvore() {
        return (
            this.raiz.imprimirArvore()
        )
    }
}

export class Expressao extends Component {
    imprimirArvore() {
    }

    mutar(matriz) {
    }

    processar(padrao, matriz) {
    }

    getFuncao() {
    }

    isTerminal() {

    }
}

export class Variavel extends Expressao {

    static CONSTANTE = 1;
    static ESTATICA = 2;
    static SENO = 3;
    static COSENO = 4;
    static TANG = 5;

    static VARIAVEL_DISPONIVEIS = [1, 1, 1, 2, 3, 4, 5];

    constructor(matriz) {
        super();
        this.constante = null;
        this.tipo = null;
        this.variavel = null;
        this.reload(matriz);
    }

    isTerminal() {
        return true;
    }

    processar(padrao, matriz) {
        if (this.tipo === Variavel.CONSTANTE) {
            return this.constante;
        } else if (this.tipo === Variavel.ESTATICA) {
            return matriz[padrao][this.variavel];
        } else if (this.tipo === Variavel.SENO) {
            return Math.sin(matriz[padrao][this.variavel]);
        } else if (this.tipo === Variavel.COSENO) {
            return Math.cos(matriz[padrao][this.variavel]);
        } else if (this.tipo === Variavel.TANG) {
            return Math.tan(matriz[padrao][this.variavel]);
        }
    }

    getFuncao() {
        if (this.tipo === Variavel.CONSTANTE) {
            return this.constante;
        } else if (this.tipo === Variavel.ESTATICA) {
            return "x" + this.variavel;
        } else if (this.tipo === Variavel.SENO) {
            return "sin(x" + this.variavel + ")";
        } else if (this.tipo === Variavel.COSENO) {
            return "cos(x" + this.variavel + ")";
        } else if (this.tipo === Variavel.TANG) {
            return "tan(x" + this.variavel + ")";
        }
    }

    mutar(matriz) {
        this.reload(matriz);
    }

    reload(matriz) {

        this.tipo = Variavel.VARIAVEL_DISPONIVEIS[Math.floor((Math.random() * Variavel.VARIAVEL_DISPONIVEIS.length))];

        let op = Math.floor((Math.random() * 5) + 1);
        let constante = this.constante;
        if (op === 1) {
            constante = constante + 0.1;
        } else if (op === 2) {
            constante = constante - 0.1;
        } else if (op === 3) {
            constante = constante / 10;
        } else if (op === 4) {
            constante = constante * 10;
        } else if (op === 5) {
            constante = Math.floor((Math.random() * 10) + 1);
        }
        this.constante = constante;

        let totalVars = matriz[0].length - 2;
        this.variavel = Math.floor((Math.random() * totalVars) + 1);
    }

    imprimirArvore() {
        return (<ul>
            <li><a href="#">{this.getFuncao()}</a></li>
        </ul>)
    }
}

export class Operador extends Expressao {

    static ADICAO = 1;
    static SUBTRACAO = 2;
    static MULTIPLICACAO = 3;
    static EXPONENCIAL = 4;
    static DIVISAO = 5;

    static OPERACOESDISPONIVEIS = [1, 5, 2, 3, 4];

    constructor() {
        super();

        this.operacao = Operador.OPERACOESDISPONIVEIS[Math.floor((Math.random() * Operador.OPERACOESDISPONIVEIS.length))]
        this.esquerda = null;
        this.direita = null;
    }

    isTerminal() {
        return false;
    }

    processar(padrao, matriz) {

        if (this.operacao === Operador.ADICAO) {
            return this.getEsquerda().processar(padrao, matriz) + this.getDireita().processar(padrao, matriz);
        } else if (this.operacao === Operador.SUBTRACAO) {
            return this.getEsquerda().processar(padrao, matriz) - this.getDireita().processar(padrao, matriz);
        } else if (this.operacao === Operador.EXPONENCIAL) {
            return this.getEsquerda().processar(padrao, matriz) ** this.getDireita().processar(padrao, matriz);
        } else if (this.operacao === Operador.DIVISAO) {
            return this.getEsquerda().processar(padrao, matriz) / this.getDireita().processar(padrao, matriz);
        } else {
            return this.getEsquerda().processar(padrao, matriz) * this.getDireita().processar(padrao, matriz);
        }
    }

    getEsquerda() {
        return this.esquerda;
    }

    getDireita() {
        return this.direita;
    }

    setEsquerda(esquerda) {
        this.esquerda = esquerda;
    }

    setDireita(direita) {
        this.direita = direita;
    }

    operador(op) {
        if (op === Operador.ADICAO) {
            return "+";
        } else if (op === Operador.SUBTRACAO) {
            return "-";
        } else if (op === Operador.EXPONENCIAL) {
            return "^";
        } else if (op === Operador.MULTIPLICACAO) {
            return "*";
        } else if (op === Operador.DIVISAO) {
            return "/";
        } else {
            return "nao encontrou operador";
        }
    }

    getFuncao() {
        let func = "";
        func = func + "(";
        func = func + this.getEsquerda().getFuncao();
        func = func + this.operador(this.operacao);
        func = func + this.getDireita().getFuncao();
        func = func + ")";
        return func;
    }

    mutar(matriz) {
        this.operacao = Operador.OPERACOESDISPONIVEIS[Math.floor((Math.random() * Operador.OPERACOESDISPONIVEIS.length))];
        this.getEsquerda().mutar(matriz);
        this.getDireita().mutar(matriz);
    }

    imprimirArvore() {
        return (
            <ul>
                <li><a href="#">{this.operador(this.operacao)}</a>
                    <ul>
                        <li>{this.getEsquerda().imprimirArvore()}</li>
                        <li>{this.getDireita().imprimirArvore()}</li>
                    </ul>
                </li>
            </ul>
        )
    }
}