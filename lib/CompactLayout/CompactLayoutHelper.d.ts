import { TreeNode } from "../types/common";
import { CompactLayoutConfiguration } from "./CompactLayoutConfiguration";
export declare const groupBy: (array: TreeNode[], accessor: (TreeNode: any) => any, aggegator: any) => [string, unknown][];
export declare const calculateCompactFlexDimensions: (root: TreeNode, compactLayout: CompactLayoutConfiguration) => void;
export declare const calculateCompactFlexPositions: (root: TreeNode, compactLayout: CompactLayoutConfiguration) => void;
