/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {ElementNode, CommandListenerEditorPriority} from 'lexical';

import {useEffect} from 'react';
import {useLexicalComposerContext} from 'lexical-react/LexicalComposerContext';
import {$log, $getSelection} from 'lexical';
import {TableNode} from 'lexical/TableNode';
import {TableCellNode} from 'lexical/TableCellNode';
import {TableRowNode} from 'lexical/TableRowNode';
import {$createTableNodeWithDimensions} from 'lexical/nodes';
import {$createParagraphNode} from 'lexical/ParagraphNode';

const EditorPriority: CommandListenerEditorPriority = 0;

export default function TablesPlugin(): React$Node {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeCommandListener = editor.addListener(
      'command',
      (type) => {
        if (type === 'insertTable') {
          $log('handleAddTable');
          const selection = $getSelection();
          if (selection === null) {
            return true;
          }
          const focusNode = selection.focus.getNode();

          if (focusNode !== null) {
            const topLevelNode = focusNode.getTopLevelElementOrThrow();
            const tableNode = $createTableNodeWithDimensions(3, 3);
            topLevelNode.insertAfter(tableNode);
            tableNode.insertAfter($createParagraphNode());
            const firstCell = tableNode
              .getFirstChildOrThrow<ElementNode>()
              .getFirstChildOrThrow<ElementNode>();
            firstCell.select();
          }
          return true;
        }
        return false;
      },
      EditorPriority,
    );

    const removeNodes = editor.registerNodes([
      TableNode,
      TableCellNode,
      TableRowNode,
    ]);

    return () => {
      removeCommandListener();
      removeNodes();
    };
  }, [editor]);

  return null;
}
