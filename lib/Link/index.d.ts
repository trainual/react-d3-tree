import React, { SyntheticEvent } from 'react';
import { Orientation, TreeLinkDatum, PathFunctionOption, PathFunction, PathClassFunction, TreeNode, Point } from '../types/common';
import { CompactLayoutConfiguration } from "../CompactLayout/CompactLayoutConfiguration";
declare type LinkEventHandler = (source: TreeNode, target: TreeNode, evt: SyntheticEvent) => void;
interface LinkProps {
    linkData: TreeLinkDatum;
    orientation: Orientation;
    pathFunc: PathFunctionOption | PathFunction;
    pathClassFunc?: PathClassFunction;
    enableLegacyTransitions: boolean;
    transitionDuration: number;
    onClick: LinkEventHandler;
    onMouseOver: LinkEventHandler;
    onMouseOut: LinkEventHandler;
    compact: boolean;
    compactLayout: CompactLayoutConfiguration;
}
declare type LinkState = {
    initialStyle: {
        opacity: number;
    };
};
export default class Link extends React.PureComponent<LinkProps, LinkState> {
    private linkRef;
    state: {
        initialStyle: {
            opacity: number;
        };
    };
    componentDidMount(): void;
    componentWillLeave(done: any): void;
    applyOpacity(opacity: number, transitionDuration: LinkProps['transitionDuration'], done?: () => void): void;
    drawStepPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']): string;
    drawDiagonalPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']): string;
    drawStraightPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']): string;
    drawElbowPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']): string;
    drawSmoothStepPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation'], compactLayout: CompactLayoutConfiguration): string;
    getSmoothPathSvg(s: Point, t: Point, m: Point): string;
    drawPath(): string;
    getClassNames(): string;
    handleOnClick: (evt: any) => void;
    handleOnMouseOver: (evt: any) => void;
    handleOnMouseOut: (evt: any) => void;
    render(): JSX.Element;
}
export {};
