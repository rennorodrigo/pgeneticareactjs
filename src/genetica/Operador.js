import React from "react";
import {Expressao} from "./Expressao";

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
                <li><span>{this.operador(this.operacao)}</span>
                    <ul>
                        <li>{this.getEsquerda().imprimirArvore()}</li>
                        <li>{this.getDireita().imprimirArvore()}</li>
                    </ul>
                </li>
            </ul>
        )
    }
}