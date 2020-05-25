import React, {Component} from "react";
import {Arvore} from "./Arvore";

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