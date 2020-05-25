import React from "react";
import {Expressao} from "./Expressao";

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
            <li><span>{this.getFuncao()}</span></li>
        </ul>)
    }
}