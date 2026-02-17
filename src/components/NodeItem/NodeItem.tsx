import React, { useState } from "react";
import type { NodeModel, NodeItemProps } from "./NodeItem.types";
import styles from "./NodeItem.module.css";

const NodeItem: React.FC<NodeItemProps> = ({
  node,
  updateNode,
  initialEditing,
}) => {
  const [editing, setEditing] = useState(
    initialEditing ?? node.type === "unset",
  );
  const [name, setName] = useState(node.name || "");
  const [addingChild, setAddingChild] = useState(false);

  // Save node name
  const handleSave = () => {
    if (!name.trim()) {
      updateNode(node.id, null);
      return;
    }
    updateNode(node.id, {
      ...node,
      name: name.trim(),
      type: node.type === "unset" ? "folder" : node.type,
    });
    setEditing(false);
  };

  // Cancel node creation
  const handleCancel = () => {
    updateNode(node.id, null);
  };

  // Add child node
  const handleAddChild = (type: "folder" | "file") => {
    const newChild: NodeModel = {
      id: crypto.randomUUID(),
      type,
      name: "",
      children: type === "folder" ? [] : undefined,
    };
    console.log("🚀 ~ handleAddChild ~ newChild:", newChild);
    updateNode(node.id, {
      ...node,
      children: [...(node.children || []), newChild],
    });
    setAddingChild(false);
  };

  // Delete node
  const handleDelete = () => {
    updateNode(node.id, null);
  };

  // Render children
  const renderChildren = () => {
    if (!node.children || node.children.length === 0) return null;
    return (
      <div className={styles.children}>
        {node.children.map((child) => (
          <NodeItem
            key={child.id}
            node={child}
            updateNode={updateNode}
            initialEditing={child.name === ""}
          />
        ))}
      </div>
    );
  };

  // UI
  return (
    <div className={styles.nodeItem}>
      <div className={styles.nodeHeader}>
        {editing ? (
          <>
            <input
              className={styles.nameInput}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <button className={styles.saveBtn} onClick={handleSave}>
              Save
            </button>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className={styles.nodeName}>
              <img
                src={
                  node.type === "folder"
                    ? "../../../public/folder-open-regular.svg"
                    : "../../../public/file-regular.svg"
                }
                alt={node.type === "folder" ? "Folder" : "File"}
                className={styles.icon}
              />{" "}
              {node.name}
            </span>
            <div className={styles.actions}>
              {node.type === "folder" && (
                <button
                  className={styles.addChildBtn}
                  onClick={() => setAddingChild(true)}
                  title="Add child node"
                >
                  +
                </button>
              )}
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                title="Delete node"
              >
                &#x1F5D1;
              </button>
            </div>
          </>
        )}
      </div>
      {addingChild && !editing && (
        <div className={styles.childTypeSelect}>
          <button
            className={styles.createFolder}
            onClick={() => handleAddChild("folder")}
          >
            Add Folder
          </button>
          <button
            className={styles.createFile}
            onClick={() => handleAddChild("file")}
          >
            Add File
          </button>
        </div>
      )}
      {renderChildren()}
    </div>
  );
};

export default NodeItem;
