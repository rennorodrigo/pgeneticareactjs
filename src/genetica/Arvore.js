import {Component} from "react";
import {Operador} from "./Operador";
import {Variavel} from "./Variavel";

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