import React from "react";
import {Server} from "../types";
import {Col, Image, Row} from "react-bootstrap";

export type ServerProps = {
    server: Server;
    position: number;
}

export class ServerComponent extends React.Component<ServerProps, any> {
    render() {
        let server = this.props.server;
        let position = this.props.position;
        return (
            <Col className={"server-view"}>
                <Row>
                    <Col xs={10}>
                        <Row><Image src={server.gif}></Image></Row>
                        <Row>
                            <Col><h1>{server.name}</h1></Col>
                            <Col className={"server-head-info"}></Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <Row className={"server-rank"}>
                            {<h1>#{position}</h1>}
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    }
}