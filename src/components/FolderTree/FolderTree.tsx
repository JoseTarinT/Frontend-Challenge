import React, { useState } from "react";
import type { NodeModel } from "../NodeItem/NodeItem.types";
import styles from "./FolderTree.module.css";
import NodeItem from "../NodeItem/NodeItem";

const FolderTree: React.FC = () => {
  const [nodes, setNodes] = useState<NodeModel[]>([]);

  // Add root folder
  const handleAddRootFolder = () => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: "unset",
        name: "",
        children: [],
      },
    ]);
  };

  // Update node tree
  const handleUpdateNode = (id: string, updatedNode: NodeModel | null) => {
    const update = (items: NodeModel[]): NodeModel[] => {
      return items
        .map((item) => {
          if (item.id === id) {
            return updatedNode ? updatedNode : null;
          }
          if (item.children) {
            return {
              ...item,
              children: update(item.children).filter(Boolean) as NodeModel[],
            };
          }
          return item;
        })
        .filter(Boolean) as NodeModel[];
    };
    setNodes(update(nodes));
  };

  return (
    <div className={styles.treeContainer}>
      <button className={styles.addRootBtn} onClick={handleAddRootFolder}>
        Add folder to root
      </button>
      <div className={styles.treeList}>
        {nodes.map((node) => (
          <NodeItem
            key={node.id}
            node={node}
            updateNode={handleUpdateNode}
            isRoot={true}
          />
        ))}
      </div>
      <div className={styles.jsonOutput}>
        <label htmlFor="jsonTree">Folder Structure JSON:</label>
        <textarea
          id="jsonTree"
          className={styles.jsonTextarea}
          value={JSON.stringify(nodes, null, 2)}
          readOnly
          rows={8}
        />
      </div>
    </div>
  );
};

export default FolderTree;
