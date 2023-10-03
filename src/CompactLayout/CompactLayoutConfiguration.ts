import {TreeNode} from "../types/common";

export interface CompactLayoutConfiguration {
  linkCompactXStart?: (node:TreeNode) => number,
  linkCompactYStart?: (node:TreeNode) => number,
  compactLinkMidX?: (node:TreeNode) => number,
  compactLinkMidY?: (node:TreeNode) => number,
  compactDimension?: {
    sizeColumn?: (node:TreeNode) => number,
    sizeRow?: (node:TreeNode) => number,
  },
  linkX?: (node:TreeNode) => number,
  linkY?: (node:TreeNode) => number,
  linkParentX?: (node:TreeNode) => number,
  linkParentY?: (node:TreeNode) => number,
  nodeFlexSize?: (params: NodeFlexSize) => number[],
  compactMarginPair?: (node:TreeNode) => number,
  compactMarginBetween?: () => number,
  siblingsMargin: (node:TreeNode) => number,
  childrenMargin: (node:TreeNode) => number,
}

interface NodeFlexSize {
  height: number
  width: number
  compact: boolean
  node: TreeNode
}
