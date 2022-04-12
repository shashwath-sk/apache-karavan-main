import React from 'react';
import {
    Button,
    Modal,
    ActionGroup,
    Text,
    CardHeader,
    CardActions,
    Badge, Flex, CardTitle,
} from '@patternfly/react-core';
import '../designer/karavan.css';
import {TableComposable, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {Component} from "karavan-core/lib/model/ComponentModels";
import {camelIcon} from "../designer/utils/CamelUi";
import {ComponentApi} from "karavan-core/lib/api/ComponentApi";
import {ComponentProperty} from "karavan-core/src/core/model/ComponentModels";

interface Props {
    component?: Component,
    isOpen: boolean;
}

interface State {
    isOpen: boolean;
    component?: Component,
}

export class ComponentModal extends  React.Component<Props, State> {

    public state: State = {
        isOpen: this.props.isOpen,
        component: this.props.component,
    };

    setModalOpen = (open: boolean) => {
        this.setState({isOpen: false});
    }

    componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) => {
        if (prevState.isOpen !== this.props.isOpen) {
            this.setState({isOpen: this.props.isOpen});
        }
    }

    render() {
        const component = this.state.component;
        const props = new Map<string, ComponentProperty>();
        if (component){
            ComponentApi.getComponentProperties(component?.component.name, "consumer").forEach(cp => props.set(cp.name, cp));
            ComponentApi.getComponentProperties(component?.component.name, "producer").forEach(cp => props.set(cp.name, cp));
        }
        return (
            <Modal
                aria-label={"Kamelet"}
                width={'fit-content'}
                maxLength={200}
                title={component?.component.title}
                isOpen={this.state.isOpen}
                onClose={() => this.setModalOpen(false)}
                actions={[
                    <div className="modal-footer">
                        <ActionGroup className="deploy-buttons">
                            <Button key="cancel" variant="primary"
                                    onClick={e => this.setModalOpen(false)}>Close</Button>
                        </ActionGroup>
                    </div>
                ]}
            >
                <Flex direction={{default: 'column'}} key={component?.component.name}
                      className="kamelet-modal-card">
                    <CardHeader>
                        <img draggable="false" src={camelIcon} className="kamelet-icon" alt=""></img>
                        <CardActions>
                            <Badge className="badge"
                                   isRead> {component?.component.label}</Badge>
                        </CardActions>
                    </CardHeader>
                    <Text className="description">{component?.component.description}</Text>
                    {props.size !== 0 &&
                    <div>
                        <CardTitle>Properties</CardTitle>
                        <TableComposable aria-label="Simple table" variant='compact'>
                            <Thead>
                                <Tr>
                                    <Th key='name'>Display Name / Name</Th>
                                    <Th key='desc'>Description</Th>
                                    <Th key='type'>Type</Th>
                                    <Th key='label'>Label</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {Array.from(props.values()).map((p: ComponentProperty, idx: number) => (
                                    <Tr key={idx}>
                                        <Td key={`${idx}_name`}>
                                            <div>
                                                <b>{p.displayName}</b>
                                                <div>{p.name}</div>
                                            </div>
                                        </Td>
                                        <Td key={`${idx}_desc`}><div>
                                            <div>{p.description}</div>
                                            {p.defaultValue && p.defaultValue.toString().length > 0 && <div>{"Default value: " + p.defaultValue}</div>}
                                        </div></Td>
                                        <Td key={`${idx}_type`}>{p.type}</Td>
                                        <Td key={`${idx}_label`}>{p.label}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </TableComposable>
                    </div>
                    }
                </Flex>
            </Modal>
        )
    }
}