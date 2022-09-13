import {CompactLayoutConfiguration} from "./CompactLayoutConfiguration";
import {TreeNode} from "../types/common";

export const VerticalDefaultLayout: CompactLayoutConfiguration = {
  linkCompactXStart: node => node.x + (node.data.__rd3t.compact.compactEven ? node.width / 2 : -node.width / 2),
  linkCompactYStart: node => node.y + node.height / 2,
  compactLinkMidX: function (node) {
    const compactState = node.data.__rd3t.compact;
    return compactState.firstCompactNode.x + compactState.firstCompactNode.data.__rd3t.compact.flexCompactDim[0] / 4 + this.compactMarginPair(node) / 4;
  },
  compactLinkMidY: node => node.data.__rd3t.compact.firstCompactNode.y,
  compactDimension: {
    sizeColumn: node => node.width,
    sizeRow: node => node.height,
  },
  linkX: node => node.x,
  linkY: node => node.y,
  linkParentX: node => node.x,
  linkParentY: node => node.y + node.height,
  nodeFlexSize: function({ height, width, compact, node }): [number, number] {
    const compactState = node.data.__rd3t.compact;
    if (compact && compactState.flexCompactDim) {
      return [compactState.flexCompactDim[0], compactState.flexCompactDim[1]];
    };
    return [width + this.siblingsMargin(node), height + this.childrenMargin(node)];
  },
  compactMarginPair: node => 100,
  compactMarginBetween: () => 20,
  siblingsMargin: (node) => 50,
  childrenMargin: (node) => 50,
};

export const HorizontalDefaultLayout: CompactLayoutConfiguration = {
  linkX: node => node.x,
  linkY: node => node.y,
  linkCompactXStart: node => node.x + node.width / 2,
  linkCompactYStart: node => node.y + (node.data.__rd3t.compact.compactEven ? node.height / 2 : -node.height / 2),
  compactLinkMidX: (node) => node.data.__rd3t.compact.firstCompactNode.x,
  compactLinkMidY: function (node) {
    return node.data.__rd3t.compact.firstCompactNode.y + node.data.__rd3t.compact.firstCompactNode.data.__rd3t.compact.flexCompactDim[0] / 4 + this.compactMarginPair(node) / 4
  },
  linkParentX: node => node.x + node.width,
  linkParentY: node => node.y,
  compactDimension: {
    sizeColumn: node => node.height,
    sizeRow: node => node.width,
  },
  nodeFlexSize: function({ height, width, compact, node }) {
    if (compact && node.data.__rd3t.compact.flexCompactDim) {
      const result = [node.data.__rd3t.compact.flexCompactDim[0], node.data.__rd3t.compact.flexCompactDim[1]]
      return result;
    };
    return [height + this.siblingsMargin(node), width + this.childrenMargin(node)]
  },
  compactMarginPair: node => 100,
  compactMarginBetween: () => 20,
  siblingsMargin: (node) => 50,
  childrenMargin: (node) => 50,
};
