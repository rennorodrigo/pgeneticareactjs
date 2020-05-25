import React, {Component} from 'react';
import { Button, Card, CardBody, Form, Input, CardHeader, CardFooter } from 'reactstrap';
import {Line} from 'react-chartjs-2';
import {
    Col,
    Row,
} from 'reactstrap';

import {Treinamento} from '../genetica/ProgramacaoGenetica'

var SmoothieComponent = require('react-smoothie').default;

class Dashboard extends Component {

    constructor(props) {
        super(props);

        let populacao = 15;
        let matrizStr = '[2261,2261,13,05,2020,07],[2260,2260,09,05,2020,12],[2259,2259,07,05,2020,20],[2258,2258,05,05,2020,01],[2257,2257,02,05,2020,18],[2256,2256,29,04,2020,09],[2255,2255,25,04,2020,15],[2254,2254,22,04,2020,04],[2253,2253,18,04,2020,31],[2252,2252,15,04,2020,01],[2251,2251,11,04,2020,05],[2250,2250,08,04,2020,27],[2249,2249,04,04,2020,04],[2248,2248,01,04,2020,09],[2247,2247,28,03,2020,01],[2246,2246,25,03,2020,05],[2245,2245,21,03,2020,11],[2244,2244,18,03,2020,03],[2243,2243,14,03,2020,14],[2242,2242,12,03,2020,05],[2241,2241,10,03,2020,01],[2240,2240,07,03,2020,07],[2239,2239,04,03,2020,07],[2238,2238,29,02,2020,11],[2237,2237,27,02,2020,11],[2236,2236,22,02,2020,07],[2235,2235,19,02,2020,14],[2234,2234,15,02,2020,04],[2233,2233,12,02,2020,04],[2232,2232,08,02,2020,07],[2231,2231,05,02,2020,04],[2230,2230,01,02,2020,07],[2229,2229,29,01,2020,06],[2228,2228,25,01,2020,09],[2227,2227,23,01,2020,06],[2226,2226,21,01,2020,02],[2225,2225,18,01,2020,01],[2224,2224,15,01,2020,16],[2223,2223,11,01,2020,02]';
        let matriz = this.iniciar(matrizStr);
        let totalTreino = Math.floor(matriz.length / 2);


        this.state = {
            treinamento: new Treinamento(matriz, populacao, totalTreino),
            populacao: populacao,
            treino: totalTreino,
            matriz: matriz,
            matrizStr: "[" + matriz.join('],\n[') + "]",
            geracao: 0
        };
        this.chart = React.createRef();
    }

    iniciar(matrizStr) {

        if(matrizStr === '') {
            let matriz = [];
            for (let i = 0; i < 50; i++) {
                matriz.push([i + 1, i + 1, this.func(i + 1)]);
            }
            return matriz;
        } else {

            matrizStr = matrizStr.replace(/ /gi, "");
            matrizStr = matrizStr.replace(/\[/gi, "");
            matrizStr = matrizStr.replace(/\n/gi, "");
            matrizStr = matrizStr.replace(/\],/gi, "]");

            let linhas = matrizStr.split(']');

            let matriz = [];
            for (let i = 0; i < linhas.length; i++) {
                if (linhas[i] !== "") {
                    matriz.push(linhas[i].split(","));
                }
            }
            console.log(matriz);
            return matriz;
        }
    }

    func(x) {
        return (Math.cos(x) / 9 )

        //return Math.pow(x,x);
        //return x+x/x*x;
        //return Math.cos(1) +(x/x**x) - Math.sin(x);
    }

    componentDidMount() {

        var ts1 =  this.chart.current.addTimeSeries({
            strokeStyle: 'rgba(0, 255, 0, 1)',
            fillStyle: 'rgba(0, 255, 0, 0.2)',
            lineWidth: 2,
        });

        setInterval(() => {
            this.state.treinamento.treinar();
            this.setState({dataset2: this.state.treinamento.previsao()});
            this.setState({geracao: this.state.geracao + 1});
            ts1.append(new Date().getTime(), this.state.treinamento.erroMedioGeral);
        }, 1);
    }

    print() {
        return {
            labels: this.state.treinamento.labels,
            datasets: [
                {
                    label: 'Dados Originais',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.treinamento.valoresReais
                },
                {
                    label: 'Previsão',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'green',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'green',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.dataset2
                }
            ]
        }
    }

    zerar = e => {
        e.preventDefault();
        let matriz = this.iniciar(this.state.matrizStr);
        let registrosTreinamento = this.state.treino;;
        if(this.state.treino >= matriz.length) {
            registrosTreinamento = Math.floor(matriz.length / 2);
        }
        this.setState({matriz: matriz});
        this.setState({treino: registrosTreinamento});
        this.setState({geracao: 0});
        this.setState({treinamento: new Treinamento(matriz, this.state.populacao, registrosTreinamento)})
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    render() {
        return (
            <Row>
                <Col className={"col-12"}>
                    <Row>
                        <Col className={"col-12 text-left"}>
                            <Row>
                                <Col className={"col-12 text-left mt-4"}>
                                    <Card>
                                        <CardHeader>
                                            Parâmetros
                                        </CardHeader>
                                        <CardBody>
                                            <Form autoComplete="off" onSubmit={this.zerar}>
                                                <Row className="mb-4">
                                                    <Col sm={"12"} lg={"4"}>
                                                        <Row>
                                                            <Col sm={"6"} lg="6">
                                                                <label>Total Registros</label>
                                                                <Input disabled={true} value={this.state.matriz.length}/>
                                                            </Col>
                                                            <Col sm={"6"} lg="6">
                                                                <label>Geração</label>
                                                                <Input disabled={true} value={this.state.geracao}/>
                                                            </Col>
                                                            <Col sm={"6"} lg="6">
                                                                <label>Total Treinamento</label>
                                                                <Input value={this.state.treino} type="text" id="treino" name="treino"
                                                                       placeholder="Total treinamento" onChange={this.handleChange}/>
                                                            </Col>
                                                            <Col sm={"6"} lg="6">
                                                                <label>População</label>
                                                                <Input value={this.state.populacao} type="text" id="populacao" name="populacao"
                                                                       placeholder="População" onChange={this.handleChange}/>
                                                            </Col>
                                                            <Col sm={"6"} lg="6">
                                                                <label className={"col-12"}></label>
                                                                <Button type="submit" size="md" color="primary"><i
                                                                    className="fa fa-dot-circle-o"></i> Reiniciar</Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col sm={"12"} lg="8">
                                                        <label>Dados</label>
                                                        <textarea onChange={this.handleChange} id="matrizStr" name="matrizStr" style={{height: "200px"}} className={"form-control"} value={this.state.matrizStr}>{this.state.matrizStr}</textarea>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col className={"col-12 mt-4"}>
                                    <Card>
                                        <CardHeader>
                                            Gráfico
                                        </CardHeader>
                                        <CardBody>
                                            <div className="chart-wrapper">
                                                <Line data={this.print()}/>
                                            </div>
                                        </CardBody>
                                        <CardFooter>
                                            <Row>
                                                <Col className="col-sm-12 col-lg-3">
                                                    <Card className={""}>
                                                        <CardBody>
                                                            <div className="mb-0">{this.state.treinamento.erroMedioGeral.toFixed(3)}</div>
                                                            <small className="text-muted text-uppercase font-weight-bold">Erro Médio</small>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col className="col-lg-6 col-sm-12">
                                                    <Card className={""}>
                                                        <CardBody>
                                                            <div className="mb-0">{this.state.treinamento.getFuncao()}</div>
                                                            <small className="text-muted text-uppercase font-weight-bold">Função Gerada</small>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col className={"col-12 mt-4"}>
                                    <Card>
                                        <CardHeader>
                                            Árvore Gerada
                                        </CardHeader>
                                        <CardBody>
                                            {this.state.treinamento.imprimirArvore()}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className={"mb-4"}>
                                <Col className={"col-12 text-left mt-4"}>
                                    <Card>
                                        <CardHeader>
                                            Erro médio
                                        </CardHeader>
                                        <CardBody>
                                            <div className="chart-wrapper">
                                                <SmoothieComponent ref={this.chart} width={window.innerWidth > 767 ? '760':'300'} height="300" />
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }

}

export default Dashboard;
