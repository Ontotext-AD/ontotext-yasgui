import {KeyboardShortcutDescription, KeyboardShortcutName} from '../models/keyboard-shortcut-description';
import {YasguiConfiguration} from '../models/yasgui-configuration';
import {YasqeButtonName} from '../models/yasqe-button-name';
import {YasqeService} from './yasqe/yasqe-service';

export class KeyboardShortcutService {
  static initKeyboardShortcutMapping = (config: YasguiConfiguration): KeyboardShortcutDescription[] => {
    const keyboardShortcutDescriptions = [];
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createTriggerAutocomplete());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createDeleteCurrentLine());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCommentCurrentLine());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCopyLineDown());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCopyLineUp());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createAutoFormat());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createIndentMore());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createIndentLess());
    if (config.yasguiConfig.yasqe.showQueryButton) {
      keyboardShortcutDescriptions.push(KeyboardShortcutService.createExecuteQuery());
      keyboardShortcutDescriptions.push(KeyboardShortcutService.createExecuteExplainPlanForQuery());
      keyboardShortcutDescriptions.push(KeyboardShortcutService.createCreateTab());
      keyboardShortcutDescriptions.push(KeyboardShortcutService.createSavedQuery());
      keyboardShortcutDescriptions.push(KeyboardShortcutService.createSwitchToNextTab());
      keyboardShortcutDescriptions.push(KeyboardShortcutService.createSwitchToPreviousTab());
      keyboardShortcutDescriptions.push(KeyboardShortcutService.createCloseAllTabs());
    }
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createF11());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createEscape());
    return keyboardShortcutDescriptions;
  };

  private static createTriggerAutocomplete(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.TRIGGER_AUTOCOMPLETION;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Space');
    keyboardShortcut.keyboardShortcuts.push('Alt-Enter');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Space');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.autocomplete();
    };
    return keyboardShortcut;
  }

  private static createDeleteCurrentLine(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.DELETE_CURRENT_LINE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-D');
    keyboardShortcut.keyboardShortcuts.push('Ctrl-K');
    keyboardShortcut.keyboardShortcuts.push('Cmd-D');
    keyboardShortcut.keyboardShortcuts.push('Cmd-K');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      const lineNumber = yasqe.getDoc().getCursor().line;
      //delete current line including the linebreak after
      return yasqe.getDoc().replaceRange("",
        {ch: 0, line: lineNumber},
        {ch: 0, line: lineNumber + 1});
    };
    return keyboardShortcut;
  }

  private static createCommentCurrentLine(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.COMMENT_SELECTED_LINE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-/');
    keyboardShortcut.keyboardShortcuts.push('Cmd-/');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.commentLines();
    };
    return keyboardShortcut;
  }

  private static createCopyLineDown(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.COPY_LINE_DOWN;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Down');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Down');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      let cursor = yasqe.getCursor();
      const cursorLinePosition = cursor.ch;
      yasqe.duplicateLine();
      // Sets cursor in same position.
      cursor = yasqe.getCursor();
      cursor.ch = cursorLinePosition;
      yasqe.setCursor(cursor);

    };
    return keyboardShortcut;
  }

  private static createCopyLineUp(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.COPY_LINE_UP;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Up');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Up');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      let cursor = yasqe.getCursor();
      if (!cursor) {
        return;
      }

      const currentLine = yasqe.getDoc().getLine(cursor.line);
      if (!currentLine) {
        return;
      }
      const cursorLinePosition = cursor.ch;
      cursor.line--;
      yasqe.setCursor(cursor);

      const line = yasqe.getDoc().getLine(cursor.line);
      if (!line) {
        return;
      }

      yasqe.getDoc().replaceRange(line + "\n" + currentLine, {ch: 0, line: cursor.line}, {ch: line.length, line: cursor.line});
      // Sets cursor in same position.
      cursor = yasqe.getCursor();
      cursor.ch = cursorLinePosition;
      yasqe.setCursor(cursor);
    };
    return keyboardShortcut;
  }

  private static createAutoFormat(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.AUTO_FORMAT_SELECTED_LINE;
    keyboardShortcut.keyboardShortcuts.push('Shift-Ctrl-F');
    keyboardShortcut.keyboardShortcuts.push('Shift-Cmd-F');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.autoformat();
    };
    return keyboardShortcut;
  }

  private static createIndentMore(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.INDENT_CURRENT_LINE_MORE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-]');
    keyboardShortcut.keyboardShortcuts.push('Cmd-]');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.indentSelection('add');
    };
    return keyboardShortcut;
  }

  private static createIndentLess(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.INDENT_CURRENT_LINE_LESS;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-[');
    keyboardShortcut.keyboardShortcuts.push('Cmd-[');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.indentSelection('subtract');
    };
    return keyboardShortcut;
  }

  private static createExecuteQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.EXECUTE_QUERY_OR_UPDATE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Enter');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Enter');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.query().then().catch(() => {
        // catch this to avoid unhandled rejection
      });
    };
    return keyboardShortcut;
  }

  private static createExecuteExplainPlanForQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.EXECUTE_EXPLAIN_PLAN_FOR_QUERY;
    keyboardShortcut.keyboardShortcuts.push('Shift-Ctrl-Enter');
    keyboardShortcut.keyboardShortcuts.push('Shift-Cmd-Enter');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.query(undefined, true).catch(() => {
        // catch this to avoid unhandled rejection
      });
    };
    return keyboardShortcut;
  }

  private static createCreateTab(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.CREATE_TAB;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-T');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-T');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.emit('openNewTab');
    };
    return keyboardShortcut;
  }

  private static createSavedQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.CREATE_SAVE_QUERY;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-S');
    keyboardShortcut.keyboardShortcuts.push('Cmd-S');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      const wrapperElement = yasqe.getWrapperElement();
      const querySelector = wrapperElement.querySelector(`.${YasqeService.getActionButtonClassName(YasqeButtonName.CREATE_SAVED_QUERY)}`);
      if (querySelector) {
        querySelector.click();
      }
    };
    return keyboardShortcut;
  }

  private static createSwitchToNextTab(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.SWITCH_NEXT_TAB;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Right');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Right');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.emit('openNextTab');
    };
    return keyboardShortcut;
  }

  private static createSwitchToPreviousTab(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.SWITCH_PREVIOUS_TAB;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Left');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Left');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.emit('openPreviousTab');
    };
    return keyboardShortcut;
  }

  private static createCloseAllTabs(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.CLOSES_ALL_TABS;
    keyboardShortcut.keyboardShortcuts.push('Shift-Ctrl-F4');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Ctrl-F4');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.emit('closeOtherTabs')
    };
    return keyboardShortcut;
  }

  private static createF11(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.F11;
    keyboardShortcut.keyboardShortcuts.push('F11');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.toggleFullScreen();
    };
    return keyboardShortcut;
  }

  private static createEscape(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.ESC;
    keyboardShortcut.keyboardShortcuts.push('Esc');
    //@ts-ignore
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.leaveFullScreen();
    };
    return keyboardShortcut;
  }
}
