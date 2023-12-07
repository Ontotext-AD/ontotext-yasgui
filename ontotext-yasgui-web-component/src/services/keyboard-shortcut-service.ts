import {
  CreateKeyboardShortcutFunction,
  EXPLAIN_PLAN_TYPE,
  KeyboardShortcutDescription,
  KeyboardShortcutName
} from '../models/keyboard-shortcut-description';
import {YasguiConfiguration} from '../models/yasgui-configuration';
import {YasqeButtonName} from '../models/yasqe-button-name';
import {YasqeService} from './yasqe/yasqe-service';
import {Yasqe} from '../models/yasgui/yasqe';
import {IndentSelection} from '../models/yasgui/indent-selection';

export class KeyboardShortcutService {

  private static keyboardShortcutNameToFactoryFunction = KeyboardShortcutService.initAllKeyboardShortcuts();

  static initKeyboardShortcutMapping = (config: YasguiConfiguration): KeyboardShortcutDescription[] => {
    const keyboardShortcutDescriptions = [];
    const insertAll = !config.keyboardShortcutConfiguration || config.keyboardShortcutConfiguration.length < 1;
    KeyboardShortcutService.keyboardShortcutNameToFactoryFunction
      .forEach((factoryFunction: CreateKeyboardShortcutFunction, keyboardShortcutName: KeyboardShortcutName) => {
        if (insertAll || config.keyboardShortcutConfiguration[keyboardShortcutName] === undefined || config.keyboardShortcutConfiguration[keyboardShortcutName]) {
          keyboardShortcutDescriptions.push(factoryFunction());
        }
      });
    return keyboardShortcutDescriptions;
  };

  private static createTriggerAutocomplete(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.TRIGGER_AUTOCOMPLETION;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Space');
    keyboardShortcut.keyboardShortcuts.push('Alt-Enter');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Space');
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
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.indentSelection(IndentSelection.ADD);
    };
    return keyboardShortcut;
  }

  private static createIndentLess(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.INDENT_CURRENT_LINE_LESS;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-[');
    keyboardShortcut.keyboardShortcuts.push('Cmd-[');
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.indentSelection(IndentSelection.SUBTRACT);
    };
    return keyboardShortcut;
  }

  private static createExecuteQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.EXECUTE_QUERY_OR_UPDATE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Enter');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Enter');
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
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.query(undefined, EXPLAIN_PLAN_TYPE.EXPLAIN).catch(() => {
        // catch this to avoid unhandled rejection
      });
    };
    return keyboardShortcut;
  }

  private static createExecuteChatGPTExplainPlanForQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.EXECUTE_CHAT_GPT_EXPLAIN_PLAN_FOR_QUERY;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Enter');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Enter');
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.query(undefined, EXPLAIN_PLAN_TYPE.CHAT_GPT_EXPLAIN).catch(() => {
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
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      const wrapperElement = yasqe.getWrapperElement();
      const querySelector: HTMLButtonElement = wrapperElement.querySelector(`.${YasqeService.getActionButtonClassName(YasqeButtonName.CREATE_SAVED_QUERY)}`);
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
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.emit('closeOtherTabs')
    };
    return keyboardShortcut;
  }

  private static createFullScreen(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.FULL_SCREEN;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-F');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-F');
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.toggleFullScreen();
    };
    return keyboardShortcut;
  }

  private static createEscape(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.ESC;
    keyboardShortcut.keyboardShortcuts.push('Esc');
    keyboardShortcut.executeFunction = (yasqe: Yasqe) => {
      yasqe.leaveFullScreen();
    };
    return keyboardShortcut;
  }

  private static initAllKeyboardShortcuts(): Map<string, CreateKeyboardShortcutFunction> {
    const keyboardShortcuts = new Map<string, CreateKeyboardShortcutFunction>();
    keyboardShortcuts.set(KeyboardShortcutName.TRIGGER_AUTOCOMPLETION, KeyboardShortcutService.createTriggerAutocomplete);
    keyboardShortcuts.set(KeyboardShortcutName.DELETE_CURRENT_LINE, KeyboardShortcutService.createDeleteCurrentLine);
    keyboardShortcuts.set(KeyboardShortcutName.COMMENT_SELECTED_LINE, KeyboardShortcutService.createCommentCurrentLine);
    keyboardShortcuts.set(KeyboardShortcutName.COPY_LINE_DOWN, KeyboardShortcutService.createCopyLineDown);
    keyboardShortcuts.set(KeyboardShortcutName.COPY_LINE_UP, KeyboardShortcutService.createCopyLineUp);
    keyboardShortcuts.set(KeyboardShortcutName.AUTO_FORMAT_SELECTED_LINE, KeyboardShortcutService.createAutoFormat);
    keyboardShortcuts.set(KeyboardShortcutName.INDENT_CURRENT_LINE_MORE, KeyboardShortcutService.createIndentMore);
    keyboardShortcuts.set(KeyboardShortcutName.INDENT_CURRENT_LINE_LESS, KeyboardShortcutService.createIndentLess);
    keyboardShortcuts.set(KeyboardShortcutName.EXECUTE_QUERY_OR_UPDATE, KeyboardShortcutService.createExecuteQuery);
    keyboardShortcuts.set(KeyboardShortcutName.EXECUTE_EXPLAIN_PLAN_FOR_QUERY, KeyboardShortcutService.createExecuteExplainPlanForQuery);
    keyboardShortcuts.set(KeyboardShortcutName.EXECUTE_CHAT_GPT_EXPLAIN_PLAN_FOR_QUERY, KeyboardShortcutService.createExecuteChatGPTExplainPlanForQuery);
    keyboardShortcuts.set(KeyboardShortcutName.CREATE_TAB, KeyboardShortcutService.createCreateTab);
    keyboardShortcuts.set(KeyboardShortcutName.CREATE_SAVE_QUERY, KeyboardShortcutService.createSavedQuery);
    keyboardShortcuts.set(KeyboardShortcutName.SWITCH_NEXT_TAB, KeyboardShortcutService.createSwitchToNextTab);
    keyboardShortcuts.set(KeyboardShortcutName.SWITCH_PREVIOUS_TAB, KeyboardShortcutService.createSwitchToPreviousTab);
    keyboardShortcuts.set(KeyboardShortcutName.CLOSES_ALL_TABS, KeyboardShortcutService.createCloseAllTabs);
    keyboardShortcuts.set(KeyboardShortcutName.FULL_SCREEN, KeyboardShortcutService.createFullScreen);
    keyboardShortcuts.set(KeyboardShortcutName.ESC, KeyboardShortcutService.createEscape);
    return keyboardShortcuts;
  }
}
