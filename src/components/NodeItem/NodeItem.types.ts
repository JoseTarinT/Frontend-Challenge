export interface NodeModel {
  type: "folder" | "file" | "unset" | null;
  name?: string;
  children?: NodeModel[];
  id: string;
}

export interface NodeItemProps {
  node: NodeModel;
  updateNode: (id: string, updatedNode: NodeModel | null) => void;
  initialEditing?: boolean;
  isRoot?: boolean;
}
