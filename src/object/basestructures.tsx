import React from "react";
import {Col} from "react-bootstrap";

type ListComponentState = {
    loaded: boolean;
    updatingComponents: JSX.Element[];
}

export class LiveComponent<P, S> extends React.Component<P, S> {
    ms: number
    private thread: any;
    private readonly task: (c: LiveComponent<P, S>) => void;
    constructor(props: P, task: (c: LiveComponent<P, S>) => void, ms: number = 5000) {
        super(props);
        this.ms = ms;
        this.task = task;
        this.thread = -1;
    }
    componentDidMount() {
        this.thread = setInterval(() => this.task(this), this.ms);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
}

export abstract class ListComponent<P> extends LiveComponent<P, ListComponentState> {
    private readonly loader: JSX.Element | null;
    protected constructor(props: any, ms: number = 1000, loader: JSX.Element | null = null) {
        super(props, () => this.updateComponents(), ms);
        this.state = {
            loaded: false,
            updatingComponents: []
        }
        this.loader = loader;
    }
    async resolveComponents(props: any): Promise<JSX.Element[] | null> {
        return [];
    }
    render() {
        return (
            <Col>
                {this.state.loaded
                    ? this.state?.updatingComponents ?? []
                    : this.loader ?? null}
            </Col>
        );
    }
    async updateComponents() {
        let components = await this.resolveComponents(this.props) || [];
        await this.setState({
            loaded: true,
            updatingComponents: components
        })
    }
}