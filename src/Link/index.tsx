import React, { SyntheticEvent } from 'react';
import { linkHorizontal, linkVertical } from 'd3-shape';
import { select } from 'd3-selection';
import {
  Orientation,
  TreeLinkDatum,
  PathFunctionOption,
  PathFunction,
  PathClassFunction, TreeNode, Point,
} from '../types/common';
import {CompactLayoutConfiguration} from "../CompactLayout/CompactLayoutConfiguration";

type LinkEventHandler = (
  source: TreeNode,
  target: TreeNode,
  evt: SyntheticEvent
) => void;

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

type LinkState = {
  initialStyle: { opacity: number };
};

export default class Link extends React.PureComponent<LinkProps, LinkState> {
  private linkRef: SVGPathElement = null;

  state = {
    initialStyle: {
      opacity: 0,
    },
  };

  componentDidMount() {
    this.applyOpacity(1, this.props.transitionDuration);
  }

  componentWillLeave(done) {
    this.applyOpacity(0, this.props.transitionDuration, done);
  }

  applyOpacity(
    opacity: number,
    transitionDuration: LinkProps['transitionDuration'],
    done = () => {}
  ) {
    if (this.props.enableLegacyTransitions) {
      select(this.linkRef)
        // @ts-ignore
        .transition()
        .duration(transitionDuration)
        .style('opacity', opacity)
        .on('end', done);
    } else {
      select(this.linkRef).style('opacity', opacity);
      done();
    }
  }

  drawStepPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']) {
    const { source, target } = linkData;
    const deltaY = target.y - source.y;
    return orientation === 'horizontal'
      ? `M${source.y},${source.x} H${source.y + deltaY / 2} V${target.x} H${target.y}`
      : `M${source.x},${source.y} V${source.y + deltaY / 2} H${target.x} V${target.y}`;
  }

  drawDiagonalPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']) {
    const { source, target } = linkData;
    return orientation === 'horizontal'
      ? linkHorizontal()({
          source: [source.y, source.x],
          target: [target.y, target.x],
        })
      : linkVertical()({
          source: [source.x, source.y],
          target: [target.x, target.y],
        });
  }

  drawStraightPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']) {
    const { source, target } = linkData;
    return orientation === 'horizontal'
      ? `M${source.y},${source.x}L${target.y},${target.x}`
      : `M${source.x},${source.y}L${target.x},${target.y}`;
  }

  drawElbowPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation']) {
    return orientation === 'horizontal'
      ? `M${linkData.source.y},${linkData.source.x}V${linkData.target.x}H${linkData.target.y}`
      : `M${linkData.source.x},${linkData.source.y}V${linkData.target.y}H${linkData.target.x}`;
  }

  drawSmoothStepPath(linkData: LinkProps['linkData'], orientation: LinkProps['orientation'], compactLayout: CompactLayoutConfiguration) {
    const n = linkData.target.data.__rd3t.compact.flexCompactDim
      ? {
        x: compactLayout.compactLinkMidX(linkData.target),
        y: compactLayout.compactLinkMidY(linkData.target),
      }
      : {
        x: compactLayout.linkX(linkData.target),
        y: compactLayout.linkY(linkData.target),
      };

    const p = {
      x: compactLayout.linkParentX(linkData.source),
      y: compactLayout.linkParentY(linkData.source),
    };

    const m = linkData.target.data.__rd3t.compact.flexCompactDim
      ? {
        x: compactLayout.linkCompactXStart(linkData.target),
        y: compactLayout.linkCompactYStart(linkData.target),
      }
      : n;
    return this.getSmoothPathSvg(n, p, m);
  }

  getSmoothPathSvg(s: Point, t: Point, m: Point): string {
    const x = s.x;
    const y = s.y;
    const ex = t.x;
    const ey = t.y;

    const mx = (m && m.x) || x;
    const my = (m && m.y) || y;

    const xrvs = ex - x < 0 ? -1 : 1;
    const yrvs = ey - y < 0 ? -1 : 1;

    const rdef = 35;
    let r = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;

    r = Math.abs(ey - y) / 2 < r ? Math.abs(ey - y) / 2 : r;

    const h = Math.abs(ey - y) / 2 - r;
    const w = Math.abs(ex - x) - r * 2;
    const path = `
                    M ${mx} ${my}
                    L ${x} ${my}
                    L ${x} ${y}
                    L ${x} ${y + h * yrvs}
                    C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${
      x + r * xrvs
    } ${y + h * yrvs + r * yrvs}
                    L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
                    C  ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs} ${ex} ${
      ey - h * yrvs
    }
                    L ${ex} ${ey}`;

    return path;
  }

  drawPath() {
    const { linkData, orientation, pathFunc, compact, compactLayout } = this.props;

    if (typeof pathFunc === 'function') {
      return pathFunc(linkData, orientation, compact, compactLayout);
    }
    if (pathFunc === 'elbow') {
      return this.drawElbowPath(linkData, orientation);
    }
    if (pathFunc === 'straight') {
      return this.drawStraightPath(linkData, orientation);
    }
    if (pathFunc === 'step') {
      return this.drawStepPath(linkData, orientation);
    }
    if (pathFunc === 'rounded-step') {
      return this.drawSmoothStepPath(linkData, orientation, compactLayout);
    }
    return this.drawDiagonalPath(linkData, orientation);
  }

  getClassNames() {
    const { linkData, orientation, pathClassFunc, compact, compactLayout } = this.props;
    const classNames = ['rd3t-link'];

    if (typeof pathClassFunc === 'function') {
      classNames.push(pathClassFunc(linkData, orientation, compact, compactLayout));
    }

    return classNames.join(' ').trim();
  }

  handleOnClick = evt => {
    this.props.onClick(this.props.linkData.source, this.props.linkData.target, evt);
  };

  handleOnMouseOver = evt => {
    this.props.onMouseOver(this.props.linkData.source, this.props.linkData.target, evt);
  };

  handleOnMouseOut = evt => {
    this.props.onMouseOut(this.props.linkData.source, this.props.linkData.target, evt);
  };

  render() {
    const { linkData } = this.props;
    return (
      <path
        ref={l => {
          this.linkRef = l;
        }}
        style={{ ...this.state.initialStyle }}
        className={this.getClassNames()}
        d={this.drawPath()}
        onClick={this.handleOnClick}
        onMouseOver={this.handleOnMouseOver}
        onMouseOut={this.handleOnMouseOut}
        data-source-id={linkData.source.id}
        data-target-id={linkData.target.id}
      />
    );
  }
}
