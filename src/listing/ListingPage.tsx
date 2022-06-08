import {ListComponent, LiveComponent} from "../object/basestructures";
import React from "react";
import {PageReq} from "../types";
import {api_fetch} from "../util";
import {ServerComponent} from "./Server";
import {isArray} from "util";

import "../resources/listing/style.css";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import titleBg from "../resources/listing/heading-bg4.png";
import {
    BounceLoader,
    CircleLoader,
    ClimbingBoxLoader, ClockLoader, FadeLoader,
    HashLoader,
    MoonLoader,
    PacmanLoader,
    PropagateLoader, RotateLoader, SyncLoader
} from "react-spinners";

const head = (
    <Row className={"head-view"} style={{ backgroundImage: `url(${titleBg})` }}>
        <Col className={"head-content"}></Col>
    </Row>
);

const headToolbar = (
    <Row className={"toolbar"}>
        <Col className={"toolbar-left"}>
            <h1 className={"section-heading servers-heading"}>Servery</h1>
        </Col>
        <Col className={"toolbar-right"}>
            <div className={"d-flex justify-content-end"}>
                <Form>
                    <Form.Control type="email" placeholder="Hledej server..." />
                    <Button variant="primary" type="submit" style={{
                        marginRight: "0"
                    }}>
                        🔍
                    </Button>
                </Form>
            </div>
        </Col>
    </Row>
);
class AnnouncementContainer extends LiveComponent<any, any> {
    constructor(props: any) {
        super(props, () => this.updateCount(), 500);
    }
    render() {
        let count = this.state?.count ?? -1;
        return (
            <Row className={"announcement"}>
                <p>{
                    count > -1
                        ? `Sleduji ${count} super serverů!`
                        : "Načítám..."
                }</p>
            </Row>
        );
    }
    async updateCount() {
        let countBody = await api_fetch("/servers/count")
            .then(res => res.json());
        this.setState({
            count: countBody.count
        });
    }
}
class ListingContainer extends ListComponent<PageReq> {
    constructor(props: PageReq) {
        const loaderCss = `
          position: absolute;
          left: 50%;
        `;
        super(props, 1000, <SyncLoader css={loaderCss} color={"#0d4915"}></SyncLoader>);
    }

    async resolveComponents(props: any): Promise<JSX.Element[]> {
        let res = await api_fetch("/servers", "POST", {
            page: props.page,
            size: props.size
        }).then(res => res.json());
        let position = 0;
        return isArray(res)
            ? res.map((server: any) => {
                position++;
                return <ServerComponent server={server} position={position} key={server.id} />
            })
            : [];
    }
    render(): JSX.Element {
        return (
            <div className={"servers-container"}>
                {headToolbar}
                <Row>
                    {super.render()}
                </Row>
            </div>
        );
    }
}

export default class ListingPage extends React.Component<any, any> {
    render() {
        return (
            <Container className={"listing-content"}>
                {head}
                <AnnouncementContainer />
                <ListingContainer page={0} size={20}/>
            </Container>
        );
    }
}